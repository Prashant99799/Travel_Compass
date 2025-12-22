import { Destination } from '../../types/index.js';

export interface DestinationScore {
  destination: Destination;
  seasonalScore: number;
  budgetScore: number;
  popularityScore: number;
  finalScore: number;
}

/**
 * Calculate destination match score based on multiple factors
 * Weights: season (40%), budget (30%), popularity (30%)
 */
export function calculateDestinationScore(
  destination: Destination,
  seasonalFit: number,
  budgetFit: number
): number {
  const popularityFit = Math.min(destination.popularity_score / 100, 1);

  // Weighted combination
  const score =
    seasonalFit * 0.4 + budgetFit * 0.3 + popularityFit * 0.3;

  return Math.round(score * 100);
}

/**
 * Calculate confidence score for recommendation
 * Higher if multiple factors align well
 */
export function calculateConfidence(
  seasonalFit: number,
  budgetFit: number,
  hasRelevantTips: boolean
): number {
  let confidence = (seasonalFit + budgetFit) / 2;

  // Boost confidence if we have relevant tips
  if (hasRelevantTips) {
    confidence = Math.min(confidence + 0.15, 1);
  }

  return Math.round(confidence * 100);
}

/**
 * Generate human-readable reasons for recommendation
 */
export function generateReasons(
  destination: Destination,
  season: string,
  seasonalFit: number,
  budgetFit: number,
  hasRelevantTips: boolean
): string[] {
  const reasons: string[] = [];

  if (seasonalFit > 0.8) {
    reasons.push(`Perfect for ${season} season`);
  } else if (seasonalFit > 0.6) {
    reasons.push(`Good option for ${season} season`);
  }

  if (budgetFit > 0.8) {
    reasons.push('Matches your budget perfectly');
  } else if (budgetFit > 0.6) {
    reasons.push('Within your budget range');
  }

  if (destination.popularity_score > 80) {
    reasons.push('Highly rated by locals');
  } else if (destination.popularity_score > 60) {
    reasons.push('Popular local attraction');
  }

  if (destination.category) {
    reasons.push(`${destination.category} experience`);
  }

  if (hasRelevantTips) {
    reasons.push('Community tips available');
  }

  return reasons.slice(0, 4); // Return top 4 reasons
}
