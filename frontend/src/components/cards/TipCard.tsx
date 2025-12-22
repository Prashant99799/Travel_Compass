import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, MapPin, Calendar, MessageCircle } from 'lucide-react';
import { Tip } from '../../types';
import { Card, SeasonBadge } from '../ui';
import { formatDate } from '../../utils';

interface TipCardProps {
  tip: Tip;
  index?: number;
}

export const TipCard: React.FC<TipCardProps> = ({ tip, index = 0 }) => {
  const [votes, setVotes] = useState({
    upvotes: tip.upvotes,
    downvotes: tip.downvotes,
    userVote: null as 'up' | 'down' | null
  });
  
  const handleVote = (type: 'up' | 'down') => {
    setVotes(prev => {
      if (prev.userVote === type) {
        // Remove vote
        return {
          ...prev,
          upvotes: type === 'up' ? prev.upvotes - 1 : prev.upvotes,
          downvotes: type === 'down' ? prev.downvotes - 1 : prev.downvotes,
          userVote: null
        };
      } else if (prev.userVote === null) {
        // Add vote
        return {
          ...prev,
          upvotes: type === 'up' ? prev.upvotes + 1 : prev.upvotes,
          downvotes: type === 'down' ? prev.downvotes + 1 : prev.downvotes,
          userVote: type
        };
      } else {
        // Switch vote
        return {
          upvotes: type === 'up' ? prev.upvotes + 1 : prev.upvotes - 1,
          downvotes: type === 'down' ? prev.downvotes + 1 : prev.downvotes - 1,
          userVote: type
        };
      }
    });
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
    >
      <Card hover padding="md">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <img
              src={tip.userAvatar}
              alt={tip.userName}
              className="w-10 h-10 rounded-full bg-slate-100"
            />
            <div>
              <p className="font-medium text-slate-900">{tip.userName}</p>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(tip.createdAt)}</span>
              </div>
            </div>
          </div>
          {tip.season && <SeasonBadge season={tip.season} size="sm" />}
        </div>
        
        {/* Destination */}
        <div className="flex items-center gap-1 mb-3 text-sm text-slate-600">
          <MapPin className="w-4 h-4" />
          <span>{tip.destinationName}</span>
        </div>
        
        {/* Content */}
        <p className="text-slate-700 mb-4 leading-relaxed">{tip.content}</p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {tip.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-slate-100 rounded text-xs text-slate-600"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote('up')}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors
                ${votes.userVote === 'up'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'text-slate-500 hover:bg-slate-100'
                }
              `}
            >
              <ThumbsUp className="w-4 h-4" />
              <span className="text-sm font-medium">{votes.upvotes}</span>
            </motion.button>
            
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleVote('down')}
              className={`
                flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors
                ${votes.userVote === 'down'
                  ? 'bg-red-100 text-red-700'
                  : 'text-slate-500 hover:bg-slate-100'
                }
              `}
            >
              <ThumbsDown className="w-4 h-4" />
              <span className="text-sm font-medium">{votes.downvotes}</span>
            </motion.button>
          </div>
          
          <button className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors">
            <MessageCircle className="w-4 h-4" />
            <span className="text-sm">Reply</span>
          </button>
        </div>
      </Card>
    </motion.div>
  );
};

export default TipCard;
