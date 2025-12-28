import { MLFeatures, Season } from '../types/index.js';
import { predictBudget, encodeTravelType, getSeasonComfortScore } from './models/budgetPredictor.js';

// Ranking weights as per MASTER_PROMPT.md
const RANKING_WEIGHTS = {
  seasonal: 0.40,    // 40% - Season is PRIMARY factor
  budget: 0.30,      // 30% - Budget compatibility
  popularity: 0.30,  // 30% - Community validation
};

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
   * Based on MASTER_PROMPT.md algorithm
   */
  static calculateSeasonalFitness(
    destinationSeasonScore: number,
    threshold: number = 60
  ): number {
    if (destinationSeasonScore < threshold) {
      // Below threshold: heavy penalty
      return destinationSeasonScore / (threshold * 2);
    }
    // Above threshold: normalize to 0.5-1 range
    return 0.5 + (destinationSeasonScore - threshold) / (100 - threshold) * 0.5;
  }

  /**
   * Calculate budget fitness score (0-1)
   * Based on MASTER_PROMPT.md algorithm
   */
  static calculateBudgetFitness(
    destinationBudget: number,
    userBudget?: number
  ): number {
    if (!userBudget) return 0.5; // No preference = neutral

    const ratio = destinationBudget / userBudget;

    if (ratio <= 1) {
      // Under budget: Good! Scale from 0.7 to 1.0
      return 0.7 + (1 - ratio) * 0.3;
    } else {
      // Over budget: Penalize exponentially
      return Math.max(0, 1 - Math.pow(ratio - 1, 2) * 2);
    }
  }

  /**
   * Calculate popularity fitness score (0-1)
   */
  static calculatePopularityFitness(popularityScore: number): number {
    return Math.min(popularityScore / 100, 1);
  }

  /**
   * Calculate final destination score using weighted combination
   */
  static calculateFinalScore(
    seasonalFit: number,
    budgetFit: number,
    popularityFit: number
  ): number {
    const score =
      seasonalFit * RANKING_WEIGHTS.seasonal +
      budgetFit * RANKING_WEIGHTS.budget +
      popularityFit * RANKING_WEIGHTS.popularity;

    return Math.round(score * 100); // 0-100 scale
  }

  /**
   * Calculate confidence score for recommendation
   */
  static calculateConfidence(
    seasonalFit: number,
    budgetFit: number,
    hasRelevantTips: boolean,
    userHasPreferences: boolean
  ): number {
    let confidence = (seasonalFit + budgetFit) / 2;

    // Boost if we have community validation
    if (hasRelevantTips) confidence += 0.10;

    // Boost if user gave us more info to work with
    if (userHasPreferences) confidence += 0.05;

    return Math.min(Math.round(confidence * 100), 100);
  }
}
