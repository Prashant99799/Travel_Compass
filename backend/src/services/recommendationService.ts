import { Season, SearchParams, Recommendation, RankedDestination, Destination } from '../types/index.js';
import { destinations, seasonal_weather, tips } from '../db/schema.js';
import { InferenceEngine } from '../ml/inference.js';
import { calculateDestinationScore, generateReasons, calculateConfidence } from '../ml/models/destinationRanker.js';
import { getCurrentSeason } from './seasonService.js';
import { db } from '../db/client.js';
import { eq, desc } from 'drizzle-orm';

interface SeasonalWeatherRecord {
  id: string;
  destination_id: string;
  season: string;
  avg_temp: number | null;
  humidity: number | null;
  rainfall: number | null;
  comfort_score: number | null;
  seasonal_score: number | null;
  description: string | null;
  best_activities: string[] | null;
}

export class RecommendationService {
  /**
   * Get recommendations based on search parameters
   * Implements the Hybrid Recommendation Algorithm from MASTER_PROMPT.md
   */
  static async getRecommendations(
    params: SearchParams
  ): Promise<Recommendation[]> {
    const startTime = Date.now();
    const currentSeason = params.season || getCurrentSeason();
    const travelType = params.travelType || 'solo';
    const days = params.days || 3;

    try {
      // STEP 1: Get all destinations
      const allDestinations = await db.select().from(destinations);

      // STEP 2: Predict budget if not provided (AI fills gaps)
      let predictedBudget = params.budget;
      if (!params.budget && days) {
        predictedBudget = InferenceEngine.predictBudget(
          days,
          travelType,
          currentSeason
        );
      }

      // STEP 3: Get seasonal data for current season
      const seasonalDataList = await db
        .select()
        .from(seasonal_weather)
        .where(eq(seasonal_weather.season, currentSeason));

      const seasonalMap = new Map<string, SeasonalWeatherRecord>(
        seasonalDataList.map((sw: SeasonalWeatherRecord) => [sw.destination_id, sw])
      );

      // STEP 4: Score and rank each destination
      const rankedDestinations: RankedDestination[] = allDestinations
        .map((dest): RankedDestination => {
          const seasonalData = seasonalMap.get(dest.id);
          const seasonScore = seasonalData?.seasonal_score || 50;
          
          // Use the enhanced inference engine scoring
          const seasonalFit = InferenceEngine.calculateSeasonalFitness(seasonScore);
          const budgetFit = InferenceEngine.calculateBudgetFitness(
            dest.avg_budget || 0,
            predictedBudget
          );
          const popularityFit = InferenceEngine.calculatePopularityFitness(
            dest.popularity_score || 50
          );

          // Convert database record to Destination type
          const destination: Destination = {
            id: dest.id,
            name: dest.name || '',
            description: dest.description || '',
            image_url: dest.image_url || '',
            category: dest.category || '',
            latitude: Number(dest.latitude) || 0,
            longitude: Number(dest.longitude) || 0,
            avg_budget: dest.avg_budget || 0,
            avg_days: dest.avg_days || 1,
            popularity_score: dest.popularity_score || 0,
            tags: dest.tags || [],
            highlights: dest.highlights || [],
            created_at: dest.created_at || new Date(),
          };

          // Calculate final score using weighted combination
          const matchScore = InferenceEngine.calculateFinalScore(
            seasonalFit,
            budgetFit,
            popularityFit
          );

          return {
            destination,
            matchScore,
            seasonalMatch: seasonalFit,
            budgetFit,
          };
        })
        // STEP 5: Filter low scores (minimum 40)
        .filter((item: RankedDestination) => item.matchScore >= 40)
        // STEP 6: Sort by score descending
        .sort((a: RankedDestination, b: RankedDestination) => b.matchScore - a.matchScore)
        // STEP 7: Take top 10
        .slice(0, 10);

      // STEP 8: Enrich with tips and generate reasons
      const recommendations = await Promise.all(
        rankedDestinations.map(async (item) => {
          const destinationTips = await db
            .select()
            .from(tips)
            .where(eq(tips.destination_id, item.destination.id))
            .orderBy(desc(tips.upvotes))
            .limit(3);

          const hasRelevantTips = destinationTips.length > 0;
          const reasons = generateReasons(
            item.destination,
            currentSeason,
            item.seasonalMatch,
            item.budgetFit,
            hasRelevantTips
          );

          const confidence = InferenceEngine.calculateConfidence(
            item.seasonalMatch,
            item.budgetFit,
            hasRelevantTips,
            !!params.budget
          );

          return {
            ...item,
            tips: destinationTips,
            reasons,
            confidence,
          };
        })
      );

      console.log(`Recommendations generated in ${Date.now() - startTime}ms`);
      return recommendations;
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return [];
    }
  }

  /**
   * Get trending tips across all destinations
   */
  static async getTrendingTips() {
    try {
      const trendingTips = await db
        .select()
        .from(tips)
        .where(eq(tips.featured, true))
        .orderBy(desc(tips.upvotes))
        .limit(10);

      return trendingTips;
    } catch (error) {
      console.error('Error getting trending tips:', error);
      return [];
    }
  }

  /**
   * Get tips for a specific destination and season
   */
  static async getTipsForDestination(
    destinationId: string,
    season?: Season
  ) {
    try {
      let query = db
        .select()
        .from(tips)
        .where(eq(tips.destination_id, destinationId));

      if (season) {
        query = db
          .select()
          .from(tips)
          .where(
            eq(tips.destination_id, destinationId) &&
            eq(tips.season, season)
          );
      }

      const result = await query.orderBy(desc(tips.upvotes)).limit(5);
      return result;
    } catch (error) {
      console.error('Error getting tips for destination:', error);
      return [];
    }
  }
}
