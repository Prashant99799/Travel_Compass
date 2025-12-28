import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { bookmarks, destinations } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

// Validation schemas
const createBookmarkSchema = z.object({
  destination_id: z.string().uuid(),
  notes: z.string().optional(),
});

/**
 * GET /api/bookmarks - Get all bookmarks for current user
 */
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userBookmarks = await db
      .select({
        id: bookmarks.id,
        destination_id: bookmarks.destination_id,
        notes: bookmarks.notes,
        created_at: bookmarks.created_at,
        destination: {
          id: destinations.id,
          name: destinations.name,
          description: destinations.description,
          image_url: destinations.image_url,
          category: destinations.category,
          avg_budget: destinations.avg_budget,
          avg_days: destinations.avg_days,
          popularity_score: destinations.popularity_score,
          tags: destinations.tags,
        }
      })
      .from(bookmarks)
      .leftJoin(destinations, eq(bookmarks.destination_id, destinations.id))
      .where(eq(bookmarks.user_id, req.userId!))
      .orderBy(bookmarks.created_at);

    res.json({
      success: true,
      data: {
        bookmarks: userBookmarks,
        count: userBookmarks.length,
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/bookmarks - Create a new bookmark
 */
router.post('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const validationResult = createBookmarkSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationResult.error.errors[0].message,
        }
      });
    }

    const { destination_id, notes } = validationResult.data;

    // Check if destination exists
    const destination = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, destination_id))
      .limit(1);

    if (destination.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Destination not found' }
      });
    }

    // Check if already bookmarked
    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.user_id, req.userId!),
          eq(bookmarks.destination_id, destination_id)
        )
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      return res.status(400).json({
        success: false,
        error: { code: 'ALREADY_BOOKMARKED', message: 'Destination already bookmarked' }
      });
    }

    // Create bookmark
    const newBookmark = await db
      .insert(bookmarks)
      .values({
        user_id: req.userId!,
        destination_id,
        notes,
      })
      .returning();

    res.status(201).json({
      success: true,
      data: { bookmark: newBookmark[0] }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/bookmarks/:destination_id - Update bookmark notes
 */
router.patch('/:destination_id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { destination_id } = req.params;
    const { notes } = req.body;

    const updated = await db
      .update(bookmarks)
      .set({ notes })
      .where(
        and(
          eq(bookmarks.user_id, req.userId!),
          eq(bookmarks.destination_id, destination_id)
        )
      )
      .returning();

    if (updated.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Bookmark not found' }
      });
    }

    res.json({
      success: true,
      data: { bookmark: updated[0] }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * DELETE /api/bookmarks/:destination_id - Remove a bookmark
 */
router.delete('/:destination_id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { destination_id } = req.params;

    const deleted = await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.user_id, req.userId!),
          eq(bookmarks.destination_id, destination_id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'NOT_FOUND', message: 'Bookmark not found' }
      });
    }

    res.json({
      success: true,
      message: 'Bookmark removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/bookmarks/check/:destination_id - Check if destination is bookmarked
 */
router.get('/check/:destination_id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { destination_id } = req.params;

    const bookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.user_id, req.userId!),
          eq(bookmarks.destination_id, destination_id)
        )
      )
      .limit(1);

    res.json({
      success: true,
      data: {
        isBookmarked: bookmark.length > 0,
        bookmark: bookmark[0] || null,
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
