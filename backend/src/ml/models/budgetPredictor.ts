import { MLFeatures } from '../../types/index.js';

export interface BudgetPredictorWeights {
  intercept: number;
  days: number;
  travelType: number;
  seasonScore: number;
  popularity: number;
}

// Pre-trained weights based on mock Ahmedabad data
export const budgetWeights: BudgetPredictorWeights = {
  intercept: 5000, // Base budget in INR
  days: 800, // 800 INR per day
  travelType: 1500, // Travel type multiplier
  seasonScore: 20, // Season comfort factor
  popularity: 15, // Popularity factor
};

/**
 * Budget Predictor: Predicts travel budget based on input features
 * Using linear regression model
 */
export function predictBudget(features: MLFeatures): number {
  const budget =
    budgetWeights.intercept +
    budgetWeights.days * features.days +
    budgetWeights.travelType * features.travelType +
    budgetWeights.seasonScore * features.seasonScore +
    budgetWeights.popularity * features.destinationPopularity;

  // Ensure reasonable budget range (3000-100000 INR)
  return Math.max(3000, Math.min(100000, Math.round(budget)));
}

/**
 * Encode travel type to numeric value
 * solo=0, couple=1, family=2, group=3
 */
export function encodeTravelType(type: string): number {
  const typeMap: Record<string, number> = {
    solo: 0,
    couple: 1,
    family: 2,
    group: 3,
  };
  return typeMap[type] || 1;
}

/**
 * Get season comfort score (0-100)
 */
export function getSeasonComfortScore(season: string): number {
  const seasonScores: Record<string, number> = {
    summer: 40,
    monsoon: 60,
    autumn: 85,
    winter: 95,
  };
  return seasonScores[season] || 50;
}
