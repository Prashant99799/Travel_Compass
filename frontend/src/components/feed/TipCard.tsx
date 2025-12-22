import React from 'react';
import { Tip } from '../../types/index.js';
import { GlassCard } from '../common/GlassCard.js';
import { SeasonBadge } from '../common/SeasonBadge.js';
import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { formatDate } from '../../utils/helpers.js';

interface TipCardProps {
  tip: Tip;
  onVote: (tipId: string, voteType: 'up' | 'down') => void;
  onDelete?: (tipId: string) => void;
  canDelete?: boolean;
}

export const TipCard: React.FC<TipCardProps> = ({
  tip,
  onVote,
  onDelete,
  canDelete = false,
}) => {
  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-3">
        <SeasonBadge season={tip.season} size="sm" />
        {canDelete && (
          <button
            onClick={() => onDelete?.(tip.id)}
            className="text-gray-400 hover:text-red-400 transition-colors"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <h4 className="text-lg font-bold text-white mb-2">
        {tip.destination_name}
      </h4>

      <p className="text-gray-300 mb-4">{tip.content}</p>

      {tip.image_url && (
        <img
          src={tip.image_url}
          alt="Tip"
          className="w-full h-40 object-cover rounded-lg mb-4"
        />
      )}

      {tip.tags && tip.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {tip.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">
          {formatDate(tip.created_at)}
        </p>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onVote(tip.id, 'up')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-sm font-semibold"
          >
            <ThumbsUp size={16} />
            {tip.upvotes}
          </button>
          <button
            onClick={() => onVote(tip.id, 'down')}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-sm font-semibold"
          >
            <ThumbsDown size={16} />
            {tip.downvotes}
          </button>
        </div>
      </div>
    </GlassCard>
  );
};
