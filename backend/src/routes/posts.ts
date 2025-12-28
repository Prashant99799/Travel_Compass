import { Router, Response } from 'express';
import { db } from '../db/client.js';
import { users, posts, post_votes, replies } from '../db/schema.js';
import { eq, desc, and, sql } from 'drizzle-orm';
import { ApiResponse, ApiError, asyncHandler } from '../utils/index.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/posts
 * Get all posts with pagination
 */
router.get(
  '/',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const tag = req.query.tag as string;
    const destinationId = req.query.destinationId as string;
    const offset = (page - 1) * limit;

    let query = db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        image_url: posts.image_url,
        tag: posts.tag,
        destination_id: posts.destination_id,
        destination_name: posts.destination_name,
        created_by: posts.created_by,
        is_edited: posts.is_edited,
        upvotes: posts.upvotes,
        downvotes: posts.downvotes,
        reply_count: posts.reply_count,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        author_name: users.name,
        author_avatar: users.avatar_url,
      })
      .from(posts)
      .leftJoin(users, eq(posts.created_by, users.id))
      .orderBy(desc(posts.created_at))
      .limit(limit)
      .offset(offset);

    const allPosts = await query;

    res.json(ApiResponse.success({
      posts: allPosts,
      page,
      limit,
      hasMore: allPosts.length === limit
    }, 'Posts retrieved successfully'));
  })
);

/**
 * GET /api/v1/posts/:postId
 * Get a single post by ID
 */
router.get(
  '/:postId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { postId } = req.params;
    const userId = req.userId;

    const post = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        image_url: posts.image_url,
        tag: posts.tag,
        destination_id: posts.destination_id,
        destination_name: posts.destination_name,
        created_by: posts.created_by,
        is_edited: posts.is_edited,
        upvotes: posts.upvotes,
        downvotes: posts.downvotes,
        reply_count: posts.reply_count,
        created_at: posts.created_at,
        updated_at: posts.updated_at,
        author_name: users.name,
        author_avatar: users.avatar_url,
      })
      .from(posts)
      .leftJoin(users, eq(posts.created_by, users.id))
      .where(eq(posts.id, postId))
      .limit(1);

    if (post.length === 0) {
      throw ApiError.notFound('Post not found');
    }

    // Check if current user has voted on this post
    let userVote = null;
    if (userId) {
      const vote = await db
        .select()
        .from(post_votes)
        .where(and(
          eq(post_votes.post_id, postId),
          eq(post_votes.voted_by, userId)
        ))
        .limit(1);
      
      userVote = vote.length > 0 ? vote[0].vote_type : null;
    }

    res.json(ApiResponse.success({
      ...post[0],
      userVote
    }, 'Post retrieved successfully'));
  })
);

/**
 * POST /api/v1/posts
 * Create a new post
 */
router.post(
  '/',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { title, content, tag, destinationId, destinationName, imageUrl } = req.body;

    if (!title || !content) {
      throw ApiError.badRequest('Title and content are required');
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw ApiError.notFound('User not found. Please sync your account first.');
    }

    const newPost = await db
      .insert(posts)
      .values({
        title,
        content,
        image_url: imageUrl || null,
        tag: tag || 'review',
        destination_id: destinationId || null,
        destination_name: destinationName || null,
        created_by: user[0].id,
      })
      .returning();

    res.status(201).json(ApiResponse.created({
      ...newPost[0],
      author_name: user[0].name,
      author_avatar: user[0].avatar_url,
    }, 'Post created successfully'));
  })
);

/**
 * PATCH /api/v1/posts/:postId
 * Update a post
 */
router.patch(
  '/:postId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { postId } = req.params;
    const { title, content, tag } = req.body;

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw ApiError.notFound('User not found');
    }

    // Check if post exists and belongs to user
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      throw ApiError.notFound('Post not found');
    }

    if (existingPost[0].created_by !== user[0].id) {
      throw ApiError.forbidden('You can only edit your own posts');
    }

    const updated = await db
      .update(posts)
      .set({
        ...(title && { title }),
        ...(content && { content }),
        ...(tag && { tag }),
        is_edited: true,
        updated_at: new Date(),
      })
      .where(eq(posts.id, postId))
      .returning();

    res.json(ApiResponse.success(updated[0], 'Post updated successfully'));
  })
);

/**
 * DELETE /api/v1/posts/:postId
 * Delete a post
 */
router.delete(
  '/:postId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { postId } = req.params;

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw ApiError.notFound('User not found');
    }

    // Check if post exists and belongs to user
    const existingPost = await db
      .select()
      .from(posts)
      .where(eq(posts.id, postId))
      .limit(1);

    if (existingPost.length === 0) {
      throw ApiError.notFound('Post not found');
    }

    if (existingPost[0].created_by !== user[0].id) {
      throw ApiError.forbidden('You can only delete your own posts');
    }

    await db.delete(posts).where(eq(posts.id, postId));

    res.json(ApiResponse.success(null, 'Post deleted successfully'));
  })
);

/**
 * GET /api/v1/posts/user/:userId
 * Get all posts by a specific user
 */
router.get(
  '/user/:userId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    const userPosts = await db
      .select({
        id: posts.id,
        title: posts.title,
        content: posts.content,
        tag: posts.tag,
        destination_name: posts.destination_name,
        is_edited: posts.is_edited,
        upvotes: posts.upvotes,
        downvotes: posts.downvotes,
        reply_count: posts.reply_count,
        created_at: posts.created_at,
        author_name: users.name,
        author_avatar: users.avatar_url,
      })
      .from(posts)
      .leftJoin(users, eq(posts.created_by, users.id))
      .where(eq(posts.created_by, userId))
      .orderBy(desc(posts.created_at));

    res.json(ApiResponse.success(userPosts, 'User posts retrieved successfully'));
  })
);

/**
 * GET /api/v1/posts/:postId/replies
 * Get all replies for a post
 */
router.get(
  '/:postId/replies',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { postId } = req.params;

    const postReplies = await db
      .select({
        id: replies.id,
        post_id: replies.post_id,
        content: replies.content,
        created_by: replies.created_by,
        parent_reply_id: replies.parent_reply_id,
        is_edited: replies.is_edited,
        upvotes: replies.upvotes,
        downvotes: replies.downvotes,
        created_at: replies.created_at,
        updated_at: replies.updated_at,
        author_name: users.name,
        author_avatar: users.avatar_url,
      })
      .from(replies)
      .leftJoin(users, eq(replies.created_by, users.id))
      .where(eq(replies.post_id, postId))
      .orderBy(replies.created_at);

    res.json(ApiResponse.success(postReplies, 'Replies retrieved successfully'));
  })
);

/**
 * POST /api/v1/posts/:postId/replies
 * Add a reply to a post
 */
router.post(
  '/:postId/replies',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { postId } = req.params;
    const { content, parentReplyId } = req.body;

    if (!content) {
      throw ApiError.badRequest('Reply content is required');
    }

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw ApiError.notFound('User not found. Please sync your account first.');
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

    // Create reply
    const newReply = await db
      .insert(replies)
      .values({
        post_id: postId,
        content,
        created_by: user[0].id,
        parent_reply_id: parentReplyId || null,
      })
      .returning();

    // Update post reply count
    await db
      .update(posts)
      .set({
        reply_count: sql`${posts.reply_count} + 1`,
      })
      .where(eq(posts.id, postId));

    res.status(201).json(ApiResponse.created({
      ...newReply[0],
      author_name: user[0].name,
      author_avatar: user[0].avatar_url,
    }, 'Reply added successfully'));
  })
);

/**
 * DELETE /api/v1/posts/:postId/replies/:replyId
 * Delete a reply
 */
router.delete(
  '/:postId/replies/:replyId',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { postId, replyId } = req.params;

    // Get user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw ApiError.notFound('User not found');
    }

    // Check if reply exists and belongs to user
    const existingReply = await db
      .select()
      .from(replies)
      .where(eq(replies.id, replyId))
      .limit(1);

    if (existingReply.length === 0) {
      throw ApiError.notFound('Reply not found');
    }

    if (existingReply[0].created_by !== user[0].id) {
      throw ApiError.forbidden('You can only delete your own replies');
    }

    await db.delete(replies).where(eq(replies.id, replyId));

    // Update post reply count
    await db
      .update(posts)
      .set({
        reply_count: sql`${posts.reply_count} - 1`,
      })
      .where(eq(posts.id, postId));

    res.json(ApiResponse.success(null, 'Reply deleted successfully'));
  })
);

export default router;
