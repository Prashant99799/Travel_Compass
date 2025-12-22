import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { TipsService } from '../services/tipsService.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { destinations } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

// Validation schemas
const createTipSchema = z.object({
  destination_id: z.string().uuid(),
  content: z.string().min(10).max(2000),
  season: z.enum(['summer', 'monsoon', 'autumn', 'winter']).optional(),
  image_url: z.string().url().optional().nullable(),
  tags: z.array(z.string()).optional(),
});

const updateTipSchema = createTipSchema.partial();

const voteTipSchema = z.object({
  vote_type: z.enum(['up', 'down']),
});

/**
 * GET /api/tips - Get all tips with optional filters
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { season, destination_id } = req.query;

    const tips = await TipsService.getAllTips(
      season as string | undefined,
      destination_id as string | undefined
    );

    res.json({
      success: true,
      tips,
      count: tips.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/tips/:id - Get single tip
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const tip = await TipsService.getTipById(id);

    if (!tip) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({
      success: true,
      tip,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tips - Create new tip
 */
router.post(
  '/',
  requireAuth,
  validateBody(createTipSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { destination_id, content, season, image_url, tags } = req.body;

      // Get destination name
      const dest = await db
        .select()
        .from(destinations)
        .where(eq(destinations.id, destination_id));

      if (!dest || dest.length === 0) {
        return res.status(404).json({ error: 'Destination not found' });
      }

      const tip = await TipsService.createTip({
        user_id: req.userId,
        destination_id,
        destination_name: dest[0].name || '',
        content,
        season,
        image_url,
        tags,
      });

      if (!tip) {
        throw new Error('Failed to create tip');
      }

      res.status(201).json({
        success: true,
        tip,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/tips/:id - Update tip
 */
router.patch(
  '/:id',
  requireAuth,
  validateBody(updateTipSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const tip = await TipsService.updateTip(id, updateData);

      if (!tip) {
        return res.status(404).json({ error: 'Tip not found' });
      }

      res.json({
        success: true,
        tip,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/tips/:id - Delete tip
 */
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const success = await TipsService.deleteTip(id);

    if (!success) {
      return res.status(404).json({ error: 'Tip not found' });
    }

    res.json({
      success: true,
      message: 'Tip deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/tips/:id/vote - Vote on tip
 */
router.post(
  '/:id/vote',
  requireAuth,
  validateBody(voteTipSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { vote_type } = req.body;

      const success = await TipsService.voteTip(req.userId!, id, vote_type);

      if (!success) {
        return res.status(400).json({ error: 'Failed to vote on tip' });
      }

      const updatedTip = await TipsService.getTipById(id);

      res.json({
        success: true,
        tip: updatedTip,
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/tips/featured - Get featured tips
 */
router.get('/featured', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tips = await TipsService.getFeaturedTips();

    res.json({
      success: true,
      tips,
      count: tips.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
