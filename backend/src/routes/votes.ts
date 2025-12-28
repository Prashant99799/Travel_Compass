import { Router, Response } from 'express';
import { db } from '../db/client.js';
import { users, posts, post_votes, replies, reply_votes } from '../db/schema.js';
import { eq, and, sql } from 'drizzle-orm';
import { ApiResponse, ApiError, asyncHandler } from '../utils/index.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * POST /api/v1/votes/post/:postId
 * Vote on a post (upvote or downvote)
 */
router.post(
  '/post/:postId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { postId } = req.params;
    const { voteType } = req.body;

    if (!voteType || !['UP', 'DOWN'].includes(voteType)) {
      throw ApiError.badRequest('Vote type must be UP or DOWN');
    }

    // Check if post exists
    const post = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      throw ApiError.notFound('Post not found');
    }

    // Check if user already voted
    const existingVote = await db
      .select()
      .from(post_votes)
      .where(and(
        eq(post_votes.post_id, postId),
        eq(post_votes.voted_by, userId)
      ))
      .limit(1);

    if (existingVote.length > 0) {
      // User already voted - update or remove
      if (existingVote[0].vote_type === voteType) {
        // Same vote type - remove vote
        await db
          .delete(post_votes)
          .where(eq(post_votes.id, existingVote[0].id));

        // Update post counts
        if (voteType === 'UP') {
          await db
            .update(posts)
            .set({ upvotes: sql`${posts.upvotes} - 1` })
            .where(eq(posts.id, postId));
        } else {
          await db
            .update(posts)
            .set({ downvotes: sql`${posts.downvotes} - 1` })
            .where(eq(posts.id, postId));
        }

        return res.json(ApiResponse.success({ action: 'removed', voteType: null }, 'Vote removed'));
      } else {
        // Different vote type - change vote
        await db
          .update(post_votes)
          .set({ vote_type: voteType, voted_at: new Date() })
          .where(eq(post_votes.id, existingVote[0].id));

        // Update post counts
        if (voteType === 'UP') {
          await db
            .update(posts)
            .set({ 
              upvotes: sql`${posts.upvotes} + 1`,
              downvotes: sql`${posts.downvotes} - 1`
            })
            .where(eq(posts.id, postId));
        } else {
          await db
            .update(posts)
            .set({ 
              upvotes: sql`${posts.upvotes} - 1`,
              downvotes: sql`${posts.downvotes} + 1`
            })
            .where(eq(posts.id, postId));
        }

        return res.json(ApiResponse.success({ action: 'changed', voteType }, 'Vote changed'));
      }
    }

    // New vote
    await db
      .insert(post_votes)
      .values({
        post_id: postId,
        voted_by: userId,
        vote_type: voteType,
      });

    // Update post counts
    if (voteType === 'UP') {
      await db
        .update(posts)
        .set({ upvotes: sql`${posts.upvotes} + 1` })
        .where(eq(posts.id, postId));
    } else {
      await db
        .update(posts)
        .set({ downvotes: sql`${posts.downvotes} + 1` })
        .where(eq(posts.id, postId));
    }

    res.status(201).json(ApiResponse.created({ action: 'added', voteType }, 'Vote added'));
  })
);

/**
 * DELETE /api/v1/votes/post/:postId
 * Remove vote from a post
 */
router.delete(
  '/post/:postId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { postId } = req.params;

    // Check if vote exists
    const existingVote = await db
      .select()
      .from(post_votes)
      .where(and(
        eq(post_votes.post_id, postId),
        eq(post_votes.voted_by, userId)
      ))
      .limit(1);

    if (existingVote.length === 0) {
      throw ApiError.notFound('Vote not found');
    }

    const voteType = existingVote[0].vote_type;

    await db
      .delete(post_votes)
      .where(eq(post_votes.id, existingVote[0].id));

    // Update post counts
    if (voteType === 'UP') {
      await db
        .update(posts)
        .set({ upvotes: sql`${posts.upvotes} - 1` })
        .where(eq(posts.id, postId));
    } else {
      await db
        .update(posts)
        .set({ downvotes: sql`${posts.downvotes} - 1` })
        .where(eq(posts.id, postId));
    }

    res.json(ApiResponse.success(null, 'Vote removed'));
  })
);

/**
 * POST /api/v1/votes/reply/:replyId
 * Vote on a reply
 */
router.post(
  '/reply/:replyId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { replyId } = req.params;
    const { voteType } = req.body;

    if (!voteType || !['UP', 'DOWN'].includes(voteType)) {
      throw ApiError.badRequest('Vote type must be UP or DOWN');
    }

    // Check if reply exists
    const reply = await db
      .select()
      .from(replies)
      .where(eq(replies.id, replyId))
      .limit(1);

    if (reply.length === 0) {
      throw ApiError.notFound('Reply not found');
    }

    // Check if user already voted
    const existingVote = await db
      .select()
      .from(reply_votes)
      .where(and(
        eq(reply_votes.reply_id, replyId),
        eq(reply_votes.voted_by, userId)
      ))
      .limit(1);

    if (existingVote.length > 0) {
      if (existingVote[0].vote_type === voteType) {
        // Remove vote
        await db
          .delete(reply_votes)
          .where(eq(reply_votes.id, existingVote[0].id));

        if (voteType === 'UP') {
          await db
            .update(replies)
            .set({ upvotes: sql`${replies.upvotes} - 1` })
            .where(eq(replies.id, replyId));
        } else {
          await db
            .update(replies)
            .set({ downvotes: sql`${replies.downvotes} - 1` })
            .where(eq(replies.id, replyId));
        }

        return res.json(ApiResponse.success({ action: 'removed', voteType: null }, 'Vote removed'));
      } else {
        // Change vote
        await db
          .update(reply_votes)
          .set({ vote_type: voteType, voted_at: new Date() })
          .where(eq(reply_votes.id, existingVote[0].id));

        if (voteType === 'UP') {
          await db
            .update(replies)
            .set({ 
              upvotes: sql`${replies.upvotes} + 1`,
              downvotes: sql`${replies.downvotes} - 1`
            })
            .where(eq(replies.id, replyId));
        } else {
          await db
            .update(replies)
            .set({ 
              upvotes: sql`${replies.upvotes} - 1`,
              downvotes: sql`${replies.downvotes} + 1`
            })
            .where(eq(replies.id, replyId));
        }

        return res.json(ApiResponse.success({ action: 'changed', voteType }, 'Vote changed'));
      }
    }

    // New vote
    await db
      .insert(reply_votes)
      .values({
        reply_id: replyId,
        voted_by: userId,
        vote_type: voteType,
      });

    if (voteType === 'UP') {
      await db
        .update(replies)
        .set({ upvotes: sql`${replies.upvotes} + 1` })
        .where(eq(replies.id, replyId));
    } else {
      await db
        .update(replies)
        .set({ downvotes: sql`${replies.downvotes} + 1` })
        .where(eq(replies.id, replyId));
    }

    res.status(201).json(ApiResponse.created({ action: 'added', voteType }, 'Vote added'));
  })
);

/**
 * GET /api/v1/votes/post/:postId
 * Get user's vote on a post
 */
router.get(
  '/post/:postId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { postId } = req.params;

    const vote = await db
      .select()
      .from(post_votes)
      .where(and(
        eq(post_votes.post_id, postId),
        eq(post_votes.voted_by, userId)
      ))
      .limit(1);

    res.json(ApiResponse.success({
      hasVoted: vote.length > 0,
      voteType: vote.length > 0 ? vote[0].vote_type : null
    }, 'Vote status retrieved'));
  })
);

/**
 * GET /api/v1/votes/reply/:replyId
 * Get user's vote on a reply
 */
router.get(
  '/reply/:replyId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { replyId } = req.params;

    const vote = await db
      .select()
      .from(reply_votes)
      .where(and(
        eq(reply_votes.reply_id, replyId),
        eq(reply_votes.voted_by, userId)
      ))
      .limit(1);

    res.json(ApiResponse.success({
      hasVoted: vote.length > 0,
      voteType: vote.length > 0 ? vote[0].vote_type : null
    }, 'Vote status retrieved'));
  })
);

export default router;
