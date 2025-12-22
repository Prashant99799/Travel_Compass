import { Season, Destination, RankedDestination, SearchParams, TravelType } from '../types';

// Get current season based on month
export function getCurrentSeason(): Season {
  const month = new Date().getMonth();
  
  // March to May (months 2-4)
  if (month >= 2 && month <= 4) return 'summer';
  
  // June to September (months 5-8)
  if (month >= 5 && month <= 8) return 'monsoon';
  
  // October to November (months 9-10)
  if (month >= 9 && month <= 10) return 'autumn';
  
  // December to February (months 11, 0, 1)
  return 'winter';
}

// Get season display info
export function getSeasonInfo(season: Season): { label: string; emoji: string; color: string; bgColor: string } {
  const seasons = {
    summer: { label: 'Summer', emoji: '☀️', color: 'text-amber-600', bgColor: 'bg-amber-50' },
    monsoon: { label: 'Monsoon', emoji: '🌧️', color: 'text-blue-600', bgColor: 'bg-blue-50' },
    autumn: { label: 'Autumn', emoji: '🍂', color: 'text-orange-600', bgColor: 'bg-orange-50' },
    winter: { label: 'Winter', emoji: '❄️', color: 'text-sky-600', bgColor: 'bg-sky-50' }
  };
  return seasons[season];
}

// Travel type weights for ML ranking
const TRAVEL_TYPE_WEIGHTS: Record<TravelType, Record<string, number>> = {
  solo: {
    peaceful: 1.5,
    photography: 1.3,
    architecture: 1.2,
    museum: 1.2,
    heritage: 1.1
  },
  couple: {
    lake: 1.5,
    peaceful: 1.4,
    nature: 1.3,
    relaxation: 1.3,
    evening: 1.2
  },
  family: {
    family: 1.8,
    kids: 1.5,
    entertainment: 1.4,
    education: 1.3,
    interactive: 1.2
  },
  friends: {
    food: 1.5,
    nightlife: 1.4,
    shopping: 1.3,
    adventure: 1.2,
    entertainment: 1.2
  }
};

// ML-based ranking algorithm
export function rankDestinations(
  destinations: Destination[],
  params: SearchParams
): RankedDestination[] {
  const { season, budget, days, travelType, categories, searchQuery } = params;
  
  return destinations
    .map(dest => {
      let score = 50; // Base score
      const factors: string[] = [];
      
      // 1. Season score (weight: 35%)
      const seasonData = dest.seasonal[season];
      const seasonScore = seasonData.score;
      score += (seasonScore / 100) * 35;
      if (seasonScore >= 85) factors.push(`Great for ${season}`);
      else if (seasonScore >= 70) factors.push(`Good for ${season}`);
      
      // 2. Budget fit (weight: 20%)
      if (budget) {
        const budgetFit = dest.avgBudget <= budget ? 1 : Math.max(0, 1 - (dest.avgBudget - budget) / budget);
        score += budgetFit * 20;
        if (dest.avgBudget <= budget * 0.5) factors.push('Budget-friendly');
        else if (dest.avgBudget <= budget) factors.push('Within budget');
      } else {
        score += 10; // Neutral if no budget specified
      }
      
      // 3. Days fit (weight: 10%)
      if (days) {
        const daysFit = dest.avgDays <= days ? 1 : 0.5;
        score += daysFit * 10;
        if (dest.avgDays <= days) factors.push('Time-efficient');
      } else {
        score += 5;
      }
      
      // 4. Travel type preference (weight: 15%)
      if (travelType) {
        const typeWeights = TRAVEL_TYPE_WEIGHTS[travelType];
        let typeBoost = 0;
        dest.tags.forEach(tag => {
          if (typeWeights[tag]) {
            typeBoost += typeWeights[tag] * 3;
          }
        });
        score += Math.min(typeBoost, 15);
        if (typeBoost >= 5) factors.push(`Perfect for ${travelType} travelers`);
      }
      
      // 5. Category match (weight: 10%)
      if (categories && categories.length > 0) {
        const categoryMatch = categories.includes(dest.category) ? 1 : 0;
        score += categoryMatch * 10;
        if (categoryMatch) factors.push('Matches your interests');
      }
      
      // 6. Popularity boost (weight: 10%)
      score += (dest.popularity / 100) * 10;
      if (dest.popularity >= 90) factors.push('Highly rated');
      
      // 7. Search query relevance
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const nameMatch = dest.name.toLowerCase().includes(query);
        const descMatch = dest.description.toLowerCase().includes(query);
        const tagMatch = dest.tags.some(t => t.includes(query));
        
        if (nameMatch) score += 15;
        else if (descMatch) score += 8;
        else if (tagMatch) score += 5;
      }
      
      // Normalize score to 0-100
      const normalizedScore = Math.min(100, Math.max(0, score));
      
      // Determine match quality
      let matchQuality: 'excellent' | 'good' | 'fair' | 'poor';
      if (normalizedScore >= 80) matchQuality = 'excellent';
      else if (normalizedScore >= 65) matchQuality = 'good';
      else if (normalizedScore >= 50) matchQuality = 'fair';
      else matchQuality = 'poor';
      
      return {
        destination: dest,
        score: normalizedScore,
        matchQuality,
        factors: factors.slice(0, 3) // Top 3 factors
      };
    })
    .sort((a, b) => b.score - a.score);
}

// Predict budget for a trip
export function predictBudget(
  destinations: Destination[],
  days: number,
  travelType: TravelType
): { min: number; avg: number; max: number } {
  const totalBase = destinations.reduce((sum, d) => sum + d.avgBudget, 0);
  
  // Multipliers based on travel type
  const multipliers: Record<TravelType, number> = {
    solo: 0.8,
    couple: 1.2,
    family: 1.8,
    friends: 1.5
  };
  
  const multiplier = multipliers[travelType];
  const perDayBase = 500; // Base per-day expense
  
  const avg = Math.round((totalBase + (perDayBase * days)) * multiplier);
  const min = Math.round(avg * 0.7);
  const max = Math.round(avg * 1.4);
  
  return { min, avg, max };
}

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Format date
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
}

// Get unique categories from destinations
export function getCategories(destinations: Destination[]): string[] {
  const categories = new Set(destinations.map(d => d.category));
  return Array.from(categories).sort();
}

// Filter destinations
export function filterDestinations(
  destinations: Destination[],
  filters: {
    categories?: string[];
    maxBudget?: number;
    maxDays?: number;
    minScore?: number;
    season?: Season;
  }
): Destination[] {
  return destinations.filter(dest => {
    if (filters.categories && filters.categories.length > 0) {
      if (!filters.categories.includes(dest.category)) return false;
    }
    if (filters.maxBudget && dest.avgBudget > filters.maxBudget) return false;
    if (filters.maxDays && dest.avgDays > filters.maxDays) return false;
    if (filters.minScore && filters.season) {
      if (dest.seasonal[filters.season].score < filters.minScore) return false;
    }
    return true;
  });
}

// Get greeting based on time
export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Clamp number
export function clamp(num: number, min: number, max: number): number {
  return Math.min(Math.max(num, min), max);
}
