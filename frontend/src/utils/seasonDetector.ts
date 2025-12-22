import { Season } from '../types/index.js';

const SEASONS = {
  summer: {
    months: [3, 4, 5],
    comfortScore: 40,
    icon: '☀️',
    description: 'Hot and dry. Best avoided.',
  },
  monsoon: {
    months: [6, 7, 8],
    comfortScore: 60,
    icon: '🌧️',
    description: 'Rainy with humid conditions.',
  },
  autumn: {
    months: [9, 10],
    comfortScore: 85,
    icon: '🍂',
    description: 'Pleasant post-monsoon weather.',
  },
  winter: {
    months: [11, 0, 1, 2],
    comfortScore: 95,
    icon: '❄️',
    description: 'Best time to visit!',
  },
};

export function getCurrentSeason(date: Date = new Date()): Season {
  const month = date.getMonth();

  for (const [season, info] of Object.entries(SEASONS)) {
    if (info.months.includes(month)) {
      return season as Season;
    }
  }

  return 'winter';
}

export function getSeasonInfo(season: Season) {
  return SEASONS[season];
}

export function getSeasonColor(season: Season): string {
  const colors: Record<Season, string> = {
    summer: 'from-orange-400 to-red-500',
    monsoon: 'from-blue-500 to-purple-600',
    autumn: 'from-orange-400 to-red-400',
    winter: 'from-blue-300 to-cyan-400',
  };
  return colors[season];
}

export function getSeasonIcon(season: Season): string {
  return SEASONS[season].icon;
}
