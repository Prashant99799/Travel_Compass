import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, IndianRupee, Star, TrendingUp } from 'lucide-react';
import { RankedDestination, Season } from '../../types';
import { Card, SeasonBadge } from '../ui';
import { formatCurrency } from '../../utils';

interface DestinationCardProps {
  rankedDestination: RankedDestination;
  season: Season;
  onClick?: () => void;
  index?: number;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({
  rankedDestination,
  season,
  onClick,
  index = 0
}) => {
  const { destination, score, matchQuality, factors } = rankedDestination;
  const seasonData = destination.seasonal[season];
  
  const qualityColors = {
    excellent: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    good: 'bg-blue-50 text-blue-700 border-blue-200',
    fair: 'bg-amber-50 text-amber-700 border-amber-200',
    poor: 'bg-slate-50 text-slate-600 border-slate-200'
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card hover onClick={onClick} padding="none" className="overflow-hidden">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Score Badge */}
          <div className="absolute top-3 right-3">
            <div className={`
              px-2.5 py-1 rounded-lg text-xs font-semibold border
              ${qualityColors[matchQuality]}
            `}>
              {Math.round(score)}% Match
            </div>
          </div>
          
          {/* Category */}
          <div className="absolute bottom-3 left-3">
            <span className="px-2.5 py-1 bg-white/90 rounded-lg text-xs font-medium text-slate-700">
              {destination.category}
            </span>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-5">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            {destination.name}
          </h3>
          
          <p className="text-sm text-slate-500 line-clamp-2 mb-4">
            {destination.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center gap-4 mb-4 text-sm text-slate-600">
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              <span>{formatCurrency(destination.avgBudget)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{destination.avgDays} day{destination.avgDays > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>{destination.popularity}%</span>
            </div>
          </div>
          
          {/* Season Info */}
          <div className="flex items-center gap-2 mb-4">
            <SeasonBadge season={season} size="sm" />
            <span className="text-xs text-slate-500">{seasonData.temp}</span>
          </div>
          
          {/* Match Factors */}
          {factors.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {factors.map((factor, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
                >
                  <TrendingUp className="w-3 h-3" />
                  {factor}
                </span>
              ))}
            </div>
          )}
        </div>
      </Card>
    </motion.div>
  );
};

export default DestinationCard;
