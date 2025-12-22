import React from 'react';
import { classNames } from '../../utils/helpers.js';
import { Season } from '../../types/index.js';
import { getSeasonIcon } from '../../utils/seasonDetector.js';

interface SeasonBadgeProps {
  season: Season;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

const seasonColors: Record<Season, string> = {
  summer: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  monsoon: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  autumn: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  winter: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const SeasonBadge: React.FC<SeasonBadgeProps> = ({
  season,
  size = 'md',
  showLabel = true,
}) => {
  return (
    <div
      className={classNames(
        'inline-flex items-center gap-1 rounded-full border glass-strong',
        seasonColors[season],
        sizeClasses[size]
      )}
    >
      <span>{getSeasonIcon(season)}</span>
      {showLabel && <span className="capitalize font-semibold">{season}</span>}
    </div>
  );
};
