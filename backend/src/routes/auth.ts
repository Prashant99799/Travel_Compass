import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { AuthRequest, requireAuth, hashPassword, verifyPassword, generateToken } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { users } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Validation schemas
const signupSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  is_native: z.boolean().optional().default(false),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

/**
 * POST /api/auth/signup - Register new user
 */
router.post('/signup', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = signupSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationResult.error.errors[0].message,
          details: validationResult.error.errors,
        }
      });
    }

    const { email, password, name, is_native } = validationResult.data;

    // Check if user exists
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'EMAIL_EXISTS',
          message: 'An account with this email already exists'
        }
      });
    }

    // Hash password
    const password_hash = await hashPassword(password);

    // Create user
    const newUser = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        password_hash,
        name,
        is_native,
      })
      .returning();

    // Generate JWT token
    const token = generateToken({
      userId: newUser[0].id,
      email: newUser[0].email,
    });

    // Return user (without password_hash)
    const { password_hash: _, ...userWithoutPassword } = newUser[0];

    res.status(201).json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/auth/login - Login user
 */
router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: validationResult.error.errors[0].message,
        }
      });
    }

    const { email, password } = validationResult.data;

    // Find user
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email.toLowerCase()));

    if (user.length === 0) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user[0].password_hash);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Invalid email or password'
        }
      });
    }

    // Generate JWT token
    const token = generateToken({
      userId: user[0].id,
      email: user[0].email,
    });

    // Return user (without password_hash)
    const { password_hash: _, ...userWithoutPassword } = user[0];

    res.json({
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/me - Get current user
 */
router.get('/me', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!));

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    // Return user (without password_hash)
    const { password_hash: _, ...userWithoutPassword } = user[0];

    res.json({
      success: true,
      data: { user: userWithoutPassword },
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/auth/profile - Get current user (alias for /me)
 */
router.get('/profile', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, req.userId!));

    if (!user || user.length === 0) {
      return res.status(404).json({
        success: false,
        error: { code: 'USER_NOT_FOUND', message: 'User not found' }
      });
    }

    const { password_hash: _, ...userWithoutPassword } = user[0];

    res.json({
      success: true,
      data: { user: userWithoutPassword },
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
      const { name, bio, preferences, avatar_url, is_native } = req.body;

      const updated = await db
        .update(users)
        .set({
          ...(name && { name }),
          ...(bio !== undefined && { bio }),
          ...(preferences && { preferences }),
          ...(avatar_url !== undefined && { avatar_url }),
          ...(is_native !== undefined && { is_native }),
          updated_at: new Date(),
        })
        .where(eq(users.id, req.userId!))
        .returning();

      if (!updated || updated.length === 0) {
        return res.status(404).json({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found' }
        });
      }

      const { password_hash: _, ...userWithoutPassword } = updated[0];

      res.json({
        success: true,
        data: { user: userWithoutPassword },
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PUT /api/auth/password - Change password
 */
router.put(
  '/password',
  requireAuth,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          error: { code: 'MISSING_FIELDS', message: 'Current and new password are required' }
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          error: { code: 'WEAK_PASSWORD', message: 'New password must be at least 6 characters' }
        });
      }

      // Get current user
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, req.userId!));

      if (!user[0]) {
        return res.status(404).json({
          success: false,
          error: { code: 'USER_NOT_FOUND', message: 'User not found' }
        });
      }

      // Verify current password
      const isValidPassword = await verifyPassword(currentPassword, user[0].password_hash);
      if (!isValidPassword) {
        return res.status(401).json({
          success: false,
          error: { code: 'INVALID_PASSWORD', message: 'Current password is incorrect' }
        });
      }

      // Hash new password and update
      const newPasswordHash = await hashPassword(newPassword);
      await db
        .update(users)
        .set({ password_hash: newPasswordHash, updated_at: new Date() })
        .where(eq(users.id, req.userId!));

      res.json({
        success: true,
        message: 'Password updated successfully'
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
