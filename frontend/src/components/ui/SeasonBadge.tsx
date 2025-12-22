import React from 'react';
import { Season } from '../../types';
import { getSeasonInfo } from '../../utils';

interface SeasonBadgeProps {
  season: Season;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const SeasonBadge: React.FC<SeasonBadgeProps> = ({
  season,
  size = 'md',
  showLabel = true
}) => {
  const info = getSeasonInfo(season);
  
  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };
  
  return (
    <span
      className={`
        inline-flex items-center gap-1 rounded-full font-medium
        ${info.bgColor} ${info.color} ${sizes[size]}
      `}
    >
      <span>{info.emoji}</span>
      {showLabel && <span>{info.label}</span>}
    </span>
  );
};

export default SeasonBadge;
