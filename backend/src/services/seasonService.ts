import { Season } from '../types/index.js';

export const SEASONS = {
  summer: {
    months: [3, 4, 5], // March, April, May
    tempRange: { min: 25, max: 45 },
    description: 'Hot and dry. Best avoided.',
    icon: '☀️',
    comfortScore: 40,
  },
  monsoon: {
    months: [6, 7, 8], // June, July, August
    tempRange: { min: 25, max: 35 },
    description: 'Rainy with humid conditions.',
    icon: '🌧️',
    comfortScore: 60,
  },
  autumn: {
    months: [9, 10], // September, October
    tempRange: { min: 20, max: 30 },
    description: 'Pleasant post-monsoon weather.',
    icon: '🍂',
    comfortScore: 85,
  },
  winter: {
    months: [11, 0, 1, 2], // Nov, Dec, Jan, Feb
    tempRange: { min: 10, max: 25 },
    description: 'Best time to visit!',
    icon: '❄️',
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
