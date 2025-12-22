import { Router, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { AuthRequest, requireAuth } from '../middleware/auth.js';
import { db } from '../db/client.js';
import { travel_plans } from '../db/schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

const createPlanSchema = z.object({
  destination_id: z.string().uuid(),
  budget: z.number().int().min(0),
  days: z.number().int().min(1),
  travel_type: z.enum(['solo', 'couple', 'family', 'group']),
  season: z.enum(['summer', 'monsoon', 'autumn', 'winter']),
  start_date: z.string().datetime().optional(),
  end_date: z.string().datetime().optional(),
  notes: z.string().optional(),
  itinerary: z.record(z.any()).optional(),
});

/**
 * GET /api/plans - Get user's travel plans
 */
router.get('/', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const plans = await db
      .select()
      .from(travel_plans)
      .where(eq(travel_plans.user_id, req.userId!));

    res.json({
      success: true,
      plans,
      count: plans.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * POST /api/plans - Create new travel plan
 */
router.post(
  '/',
  requireAuth,
  validateBody(createPlanSchema),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const {
        destination_id,
        budget,
        days,
        travel_type,
        season,
        start_date,
        end_date,
        notes,
        itinerary,
      } = req.body;

      const newPlan = await db
        .insert(travel_plans)
        .values({
          user_id: req.userId!,
          destination_id,
          budget,
          days,
          travel_type,
          season,
          start_date: start_date ? start_date : new Date().toISOString().split('T')[0],
          end_date: end_date ? end_date : undefined,
          status: 'planned',
          notes,
          itinerary,
        })
        .returning();

      res.status(201).json({
        success: true,
        plan: newPlan[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * PATCH /api/plans/:id - Update travel plan
 */
router.patch(
  '/:id',
  requireAuth,
  validateBody(createPlanSchema.partial()),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const updated = await db
        .update(travel_plans)
        .set({
          ...updateData,
          updated_at: new Date(),
        })
        .where(and(eq(travel_plans.id, id), eq(travel_plans.user_id, req.userId!)))
        .returning();

      if (!updated || updated.length === 0) {
        return res.status(404).json({ error: 'Plan not found' });
      }

      res.json({
        success: true,
        plan: updated[0],
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * DELETE /api/plans/:id - Delete travel plan
 */
router.delete('/:id', requireAuth, async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await db
      .delete(travel_plans)
      .where(and(eq(travel_plans.id, id), eq(travel_plans.user_id, req.userId!)));

    res.json({
      success: true,
      message: 'Plan deleted successfully',
    });
  } catch (error) {
    next(error);
  }
});

export default router;
