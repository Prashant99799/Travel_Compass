import { Router, Request, Response, NextFunction } from 'express';
import { db } from '../db/client.js';
import { destinations, seasonal_weather } from '../db/schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

/**
 * GET /api/destinations - Get all destinations
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const allDestinations = await db.select().from(destinations);

    res.json({
      success: true,
      destinations: allDestinations,
      count: allDestinations.length,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/destinations/:id - Get single destination
 */
router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const dest = await db
      .select()
      .from(destinations)
      .where(eq(destinations.id, id));

    if (!dest || dest.length === 0) {
      return res.status(404).json({ error: 'Destination not found' });
    }

    // Get seasonal data
    const seasonalData = await db
      .select()
      .from(seasonal_weather)
      .where(eq(seasonal_weather.destination_id, id));

    res.json({
      success: true,
      destination: dest[0],
      seasonalData,
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/seasonal-data - Get season info
 */
router.get('/seasonal-data', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { season, destination_id } = req.query;

    let query = db.select().from(seasonal_weather);

    if (season) {
      query = query.where(eq(seasonal_weather.season, season as string)) as typeof query;
    }

    if (destination_id) {
      query = query.where(eq(seasonal_weather.destination_id, destination_id as string)) as typeof query;
    }

    const data = await query;

    res.json({
      success: true,
      seasonalData: data,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
