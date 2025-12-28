import { Router, Response } from 'express';
import { db } from '../db/client.js';
import { users, posts, tips, bookmarks } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { ApiResponse, ApiError, asyncHandler } from '../utils/index.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/v1/user/profile
 * Get current user's profile
 */
router.get(
  '/profile',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        avatar_url: users.avatar_url,
        bio: users.bio,
        is_native: users.is_native,
        preferences: users.preferences,
        created_at: users.created_at,
        updated_at: users.updated_at,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw ApiError.notFound('User not found');
    }

    res.json(ApiResponse.success(user[0], 'Profile retrieved successfully'));
  })
);

/**
 * PATCH /api/v1/user/profile
 * Update current user's profile
 */
router.patch(
  '/profile',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const { name, bio, is_native, preferences, avatar_url } = req.body;

    const updated = await db
      .update(users)
      .set({
        ...(name && { name }),
        ...(bio !== undefined && { bio }),
        ...(is_native !== undefined && { is_native }),
        ...(preferences && { preferences }),
        ...(avatar_url && { avatar_url }),
        updated_at: new Date(),
      })
      .where(eq(users.id, userId))
      .returning();

    if (updated.length === 0) {
      throw ApiError.notFound('User not found');
    }

    // Return without password_hash
    const { password_hash, ...userWithoutPassword } = updated[0];

    res.json(ApiResponse.success(userWithoutPassword, 'Profile updated successfully'));
  })
);

/**
 * GET /api/v1/user/posts
 * Get current user's posts
 */
router.get(
  '/posts',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.created_by, userId))
      .orderBy(desc(posts.created_at));

    res.json(ApiResponse.success(userPosts, 'User posts retrieved successfully'));
  })
);

/**
 * GET /api/v1/user/tips
 * Get current user's tips
 */
router.get(
  '/tips',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    const userTips = await db
      .select()
      .from(tips)
      .where(eq(tips.user_id, userId))
      .orderBy(desc(tips.created_at));

    res.json(ApiResponse.success(userTips, 'User tips retrieved successfully'));
  })
);

/**
 * GET /api/v1/user/bookmarks
 * Get current user's bookmarks
 */
router.get(
  '/bookmarks',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.user_id, userId))
      .orderBy(desc(bookmarks.created_at));

    res.json(ApiResponse.success(userBookmarks, 'User bookmarks retrieved successfully'));
  })
);

/**
 * GET /api/v1/user/stats
 * Get current user's statistics
 */
router.get(
  '/stats',
  requireAuth,
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;

    // Get post count
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.created_by, userId));

    // Get tips count
    const userTips = await db
      .select()
      .from(tips)
      .where(eq(tips.user_id, userId));

    // Get bookmarks count
    const userBookmarks = await db
      .select()
      .from(bookmarks)
      .where(eq(bookmarks.user_id, userId));

    // Calculate total upvotes received
    const totalTipUpvotes = userTips.reduce((sum, tip) => sum + (tip.upvotes || 0), 0);
    const totalPostUpvotes = userPosts.reduce((sum, post) => sum + (post.upvotes || 0), 0);

    res.json(ApiResponse.success({
      postsCount: userPosts.length,
      tipsCount: userTips.length,
      bookmarksCount: userBookmarks.length,
      totalUpvotes: totalTipUpvotes + totalPostUpvotes,
    }, 'User stats retrieved successfully'));
  })
);

/**
 * GET /api/v1/user/:userId
 * Get a public user profile by ID
 */
router.get(
  '/:userId',
  asyncHandler(async (req: AuthRequest, res: Response) => {
    const { userId } = req.params;

    const user = await db
      .select({
        id: users.id,
        name: users.name,
        avatar_url: users.avatar_url,
        bio: users.bio,
        is_native: users.is_native,
        created_at: users.created_at,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0) {
      throw ApiError.notFound('User not found');
    }

    // Get public stats
    const userPosts = await db
      .select()
      .from(posts)
      .where(eq(posts.created_by, userId));

    const userTips = await db
      .select()
      .from(tips)
      .where(eq(tips.user_id, userId));

    res.json(ApiResponse.success({
      ...user[0],
      stats: {
        postsCount: userPosts.length,
        tipsCount: userTips.length,
      }
    }, 'User profile retrieved successfully'));
  })
);

export default router;
