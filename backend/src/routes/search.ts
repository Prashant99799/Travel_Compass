import { Router, Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { validateBody } from '../middleware/validation.js';
import { RecommendationService } from '../services/recommendationService.js';
import { getCurrentSeason } from '../services/seasonService.js';

const router = Router();

// Validation schemas
const searchParamsSchema = z.object({
  days: z.number().int().min(1).optional(),
  budget: z.number().int().min(0).optional(),
  travelType: z.enum(['solo', 'couple', 'family', 'group']).optional(),
  interests: z.array(z.string()).optional(),
  season: z.enum(['summer', 'monsoon', 'autumn', 'winter']).optional(),
});

/**
 * POST /api/search - Get recommendations
 */
router.post(
  '/',
  validateBody(searchParamsSchema),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const params = req.body;

      // Get recommendations using ML
      const recommendations = await RecommendationService.getRecommendations(
        params
      );

      res.json({
        success: true,
        recommendations,
        currentSeason: getCurrentSeason(),
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * GET /api/search/trending - Get trending tips
 */
router.get('/trending', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const tips = await RecommendationService.getTrendingTips();

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
