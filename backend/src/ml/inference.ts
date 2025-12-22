import { MLFeatures, Season } from '../types/index.js';
import { predictBudget, encodeTravelType, getSeasonComfortScore } from './models/budgetPredictor.js';

/**
 * Create ML features from search parameters
 */
export function createMLFeatures(
  days: number,
  travelType: string,
  season: Season,
  destinationPopularity: number = 75
): MLFeatures {
  return {
    days,
    travelType: encodeTravelType(travelType),
    seasonScore: getSeasonComfortScore(season),
    destinationPopularity,
  };
}

/**
 * Inference engine that combines multiple models
 */
export class InferenceEngine {
  /**
   * Predict budget if not provided by user
   */
  static predictBudget(
    days: number,
    travelType: string,
    season: Season,
    avgPopularity: number = 75
  ): number {
    const features = createMLFeatures(days, travelType, season, avgPopularity);
    return predictBudget(features);
  }

  /**
   * Calculate seasonal fitness score (0-1)
   */
  static calculateSeasonalFitness(
    destinationSeasonalScore: number,
    currentSeasonScore: number
  ): number {
    // Normalize scores to 0-1 range
    const normalized =
      Math.min(destinationSeasonalScore, 100) /
      Math.max(currentSeasonScore, 1);

    return Math.min(normalized, 1);
  }

  /**
   * Calculate budget fitness score (0-1)
   */
  static calculateBudgetFitness(
    destinationBudget: number,
    userBudget?: number
  ): number {
    if (!userBudget) return 0.5; // Neutral if no budget specified

    const ratio = destinationBudget / userBudget;

    // Perfect fit at 0.9-1.1 ratio
    if (ratio >= 0.9 && ratio <= 1.1) {
      return 1;
    }

    // Penalize deviations
    const deviation = Math.abs(ratio - 1);
    return Math.max(0, 1 - deviation * 0.5);
  }

  /**
   * Calculate popularity fitness score (0-1)
   */
  static calculatePopularityFitness(popularityScore: number): number {
    return Math.min(popularityScore / 100, 1);
  }
}
