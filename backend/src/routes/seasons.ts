import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { destinations, seasonal_weather } from '../db/schema.js';
import { eq, desc } from 'drizzle-orm';
import { getCurrentSeason, getSeasonInfo, SEASONS, Season } from '../services/seasonService.js';

const router = Router();

/**
 * GET /api/seasons - Get current season and all season info
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const currentSeason = getCurrentSeason();
    const currentSeasonInfo = getSeasonInfo(currentSeason);

    res.json({
      success: true,
      data: {
        current: currentSeason,
        currentInfo: currentSeasonInfo,
        seasons: SEASONS,
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/seasons/:season - Get specific season info
 */
router.get('/:season', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { season } = req.params;

    // Validate season
    if (!['summer', 'monsoon', 'autumn', 'winter'].includes(season)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SEASON', message: 'Invalid season. Use: summer, monsoon, autumn, winter' }
      });
    }

    const seasonInfo = getSeasonInfo(season as Season);

    res.json({
      success: true,
      data: {
        season,
        info: seasonInfo,
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/seasons/:season/destinations - Get best destinations for a season
 */
router.get('/:season/destinations', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { season } = req.params;
    const limit = parseInt(req.query.limit as string) || 10;

    // Validate season
    if (!['summer', 'monsoon', 'autumn', 'winter'].includes(season)) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_SEASON', message: 'Invalid season. Use: summer, monsoon, autumn, winter' }
      });
    }

    // Get seasonal data with destinations
    const seasonalDestinations = await db
      .select({
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
          highlights: destinations.highlights,
        },
        seasonal: {
          seasonal_score: seasonal_weather.seasonal_score,
          comfort_score: seasonal_weather.comfort_score,
          avg_temp: seasonal_weather.avg_temp,
          humidity: seasonal_weather.humidity,
          rainfall: seasonal_weather.rainfall,
          description: seasonal_weather.description,
          best_activities: seasonal_weather.best_activities,
        }
      })
      .from(seasonal_weather)
      .leftJoin(destinations, eq(seasonal_weather.destination_id, destinations.id))
      .where(eq(seasonal_weather.season, season))
      .orderBy(desc(seasonal_weather.seasonal_score))
      .limit(limit);

    // Transform and filter
    const results = seasonalDestinations
      .filter(item => item.destination !== null)
      .map(item => ({
        destination: item.destination,
        seasonal_score: item.seasonal.seasonal_score || 0,
        comfort_score: item.seasonal.comfort_score || 0,
        weather: {
          avg_temp: item.seasonal.avg_temp,
          humidity: item.seasonal.humidity,
          rainfall: item.seasonal.rainfall,
        },
        description: item.seasonal.description,
        recommended_activities: item.seasonal.best_activities || [],
      }));

    res.json({
      success: true,
      data: {
        season,
        seasonInfo: getSeasonInfo(season as Season),
        destinations: results,
        count: results.length,
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
