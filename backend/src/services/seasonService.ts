import { Season } from '../types/index.js';

// Re-export Season type for convenience
export type { Season };

export interface SeasonDefinition {
  months: number[];
  tempRange: { min: number; max: number };
  description: string;
  icon: string;
  comfortScore: number;
  gradient?: string;
}

export const SEASONS: Record<Season, SeasonDefinition> = {
  summer: {
    months: [2, 3, 4], // March, April, May (0-indexed)
    tempRange: { min: 25, max: 45 },
    description: 'Hot and dry. Best avoided for outdoor activities.',
    icon: '☀️',
    gradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    comfortScore: 40,
  },
  monsoon: {
    months: [5, 6, 7], // June, July, August
    tempRange: { min: 25, max: 35 },
    description: 'Rainy with humid conditions. Indoor attractions preferred.',
    icon: '🌧️',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    comfortScore: 60,
  },
  autumn: {
    months: [8, 9], // September, October
    tempRange: { min: 20, max: 32 },
    description: 'Pleasant post-monsoon weather. Great for sightseeing.',
    icon: '🍂',
    gradient: 'linear-gradient(135deg, #ff9a56 0%, #ff6a88 100%)',
    comfortScore: 85,
  },
  winter: {
    months: [10, 11, 0, 1], // November, December, January, February
    tempRange: { min: 10, max: 28 },
    description: 'Best time to visit! Perfect weather for everything.',
    icon: '❄️',
    gradient: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    comfortScore: 95,
  },
};

/**
 * Get current season based on date
 */
export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth();

  for (const [season, info] of Object.entries(SEASONS)) {
    if (info.months.includes(month)) {
      return season as Season;
    }
  }

  return 'winter'; // Default to winter
}

/**
 * Get season info
 */
export function getSeasonInfo(season: Season) {
  return SEASONS[season];
}

/**
 * Check if a given date is in a specific season
 */
export function isDateInSeason(date: Date, season: Season): boolean {
  const month = date.getMonth();
  return SEASONS[season].months.includes(month);
}

/**
 * Get all seasons with their metadata
 */
export function getAllSeasons() {
  return SEASONS;
}
