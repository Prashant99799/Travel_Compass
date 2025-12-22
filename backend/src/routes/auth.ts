import { Router, Request, Response, NextFunction } from 'express';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * GET /api/auth/profile - Get current user
 */
router.get('/profile', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!));

    if (!user || user.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      user: user[0],
    });
  } catch (error) {
    next(error);
  }
});

/**
 * PATCH /api/auth/profile - Update profile
 */
router.patch(
  '/profile',
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { name, bio, preferences } = req.body;

      // Update user (note: in real app with Clerk, this would be different)
      const updated = await db
        .update(users)
        .set({
          ...(name && { name }),
          ...(bio && { bio }),
          ...(preferences && { preferences }),
          updated_at: new Date(),
        })
        .where(eq(users.id, req.userId!))
        .returning();

      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }

      res.json({
        success: true,
        user: updated[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * POST /api/auth/register - Register new user (mock)
 */
router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, name, clerk_id } = req.body;

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existing.length > 0) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        clerk_id: clerk_id || `clerk_${Date.now()}`,
        email,
        name,
        is_native: false,
      })
      .returning();

    res.status(201).json({
      success: true,
      user: newUser[0],
    });
  } catch (error) {
    next(error);
  }
});

export default router;
