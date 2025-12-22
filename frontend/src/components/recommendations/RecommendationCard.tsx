import React from 'react';
import { Recommendation } from '../../types/index.js';
import { GlassCard } from '../common/GlassCard.js';
import { SeasonBadge } from '../common/SeasonBadge.js';
import { formatCurrency } from '../../utils/helpers.js';
import { Zap, MapPin, TrendingUp } from 'lucide-react';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onSelect: (destinationId: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onSelect,
}) => {
  const { destination, matchScore, reasons, confidence } = recommendation;

  return (
    <GlassCard
      hover
      onClick={() => onSelect(destination.id)}
      className="overflow-hidden"
    >
      <div className="relative mb-4">
        <img
          src={destination.image_url}
          alt={destination.name}
          className="w-full h-48 object-cover rounded-lg"
        />
        <div className="absolute top-3 right-3">
          <SeasonBadge season="winter" size="sm" />
        </div>
        <div className="absolute bottom-3 left-3 bg-black/40 backdrop-blur px-3 py-1 rounded-full">
          <p className="text-white font-bold flex items-center gap-1">
            <Zap size={16} className="text-yellow-400" />
            {matchScore}% Match
          </p>
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{destination.name}</h3>

      <div className="space-y-2 mb-4">
        <p className="text-gray-300 text-sm line-clamp-2">
          {destination.description}
        </p>
        <div className="flex flex-wrap gap-2">
          {destination.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-purple-500/20 text-purple-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin size={16} className="text-blue-400" />
          <span>{destination.avg_days} days</span>
        </div>
        <div className="text-gray-300">
          <span className="font-semibold text-green-400">
            {formatCurrency(destination.avg_budget)}
          </span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <p className="text-xs text-gray-400 font-semibold">Why recommended:</p>
        <ul className="space-y-1">
          {reasons.map((reason, idx) => (
            <li key={idx} className="text-xs text-gray-300 flex items-start gap-2">
              <span className="text-green-400 mt-0.5">✓</span>
              <span>{reason}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1">
          <TrendingUp size={14} />
          Confidence: {confidence}%
        </span>
        <span className="px-2 py-1 bg-gradient-primary text-white rounded font-semibold">
          View
        </span>
      </div>
    </GlassCard>
  );
};
