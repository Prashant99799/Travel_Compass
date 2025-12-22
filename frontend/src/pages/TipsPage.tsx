import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, Plus } from 'lucide-react';
import { Button, Card, Input, SeasonBadge } from '../components/ui';
import { TipCard } from '../components/cards';
import { TIPS, DESTINATIONS } from '../data';
import { Season } from '../types';
import { getCurrentSeason, getSeasonInfo } from '../utils';

type SortOption = 'trending' | 'recent' | 'season';

export const TipsPage: React.FC = () => {
  const currentSeason = getCurrentSeason();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeason, setSelectedSeason] = useState<Season | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [selectedDestination, setSelectedDestination] = useState<string | 'all'>('all');
  
  const filteredAndSortedTips = useMemo(() => {
    let result = [...TIPS];
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(tip =>
        tip.content.toLowerCase().includes(query) ||
        tip.destinationName.toLowerCase().includes(query) ||
        tip.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    // Filter by season
    if (selectedSeason !== 'all') {
      result = result.filter(tip => tip.season === selectedSeason || tip.season === null);
    }
    
    // Filter by destination
    if (selectedDestination !== 'all') {
      result = result.filter(tip => tip.destinationId === selectedDestination);
    }
    
    // Sort
    switch (sortBy) {
      case 'trending':
        result.sort((a, b) => (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes));
        break;
      case 'recent':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'season':
        result.sort((a, b) => {
          if (a.season === currentSeason && b.season !== currentSeason) return -1;
          if (a.season !== currentSeason && b.season === currentSeason) return 1;
          return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
        });
        break;
    }
    
    return result;
  }, [searchQuery, selectedSeason, sortBy, selectedDestination, currentSeason]);
  
  const uniqueDestinations = useMemo(() => {
    const destIds = new Set(TIPS.map(t => t.destinationId));
    return DESTINATIONS.filter(d => destIds.has(d.id));
  }, []);
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">Travel Tips</h1>
              <p className="text-slate-600 mt-1">
                Insider advice from fellow travelers
              </p>
            </div>
            <Button leftIcon={<Plus className="w-4 h-4" />}>
              Share a Tip
            </Button>
          </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 max-w-md">
              <Input
                placeholder="Search tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            
            {/* Sort Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setSortBy('trending')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${sortBy === 'trending' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                <TrendingUp className="w-4 h-4" />
                Trending
              </button>
              <button
                onClick={() => setSortBy('recent')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${sortBy === 'recent' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                <Clock className="w-4 h-4" />
                Recent
              </button>
              <button
                onClick={() => setSortBy('season')}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                  ${sortBy === 'season' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                {getSeasonInfo(currentSeason).emoji}
                Seasonal
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Filters Bar */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-medium text-slate-600">Filter by:</span>
            
            {/* Season Filter */}
            <div className="flex gap-1">
              <button
                onClick={() => setSelectedSeason('all')}
                className={`
                  px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                  ${selectedSeason === 'all' 
                    ? 'bg-slate-900 text-white' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                `}
              >
                All Seasons
              </button>
              {(['summer', 'monsoon', 'autumn', 'winter'] as Season[]).map((s) => {
                const info = getSeasonInfo(s);
                return (
                  <button
                    key={s}
                    onClick={() => setSelectedSeason(s)}
                    className={`
                      px-2 py-1.5 rounded-lg text-sm transition-all
                      ${selectedSeason === s 
                        ? `${info.bgColor} ${info.color}` 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                    `}
                  >
                    {info.emoji}
                  </button>
                );
              })}
            </div>
            
            {/* Destination Filter */}
            <select
              value={selectedDestination}
              onChange={(e) => setSelectedDestination(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-200 text-sm bg-white"
            >
              <option value="all">All Destinations</option>
              {uniqueDestinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tips List */}
          <div className="flex-1">
            <p className="text-sm text-slate-600 mb-6">
              Showing {filteredAndSortedTips.length} tip{filteredAndSortedTips.length !== 1 ? 's' : ''}
            </p>
            
            <div className="space-y-4">
              {filteredAndSortedTips.map((tip, index) => (
                <TipCard key={tip.id} tip={tip} index={index} />
              ))}
            </div>
            
            {filteredAndSortedTips.length === 0 && (
              <Card className="text-center py-12">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No tips found
                </h3>
                <p className="text-slate-600 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedSeason('all');
                    setSelectedDestination('all');
                  }}
                >
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-24 space-y-6">
              {/* Season Tips */}
              <Card>
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  {getSeasonInfo(currentSeason).emoji}
                  {getSeasonInfo(currentSeason).label} Tips
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {currentSeason === 'summer' && 'Beat the heat! Look for tips about early morning visits, air-conditioned attractions, and staying hydrated.'}
                  {currentSeason === 'monsoon' && 'Rainy season adventures! Find tips about indoor activities and enjoying the rain safely.'}
                  {currentSeason === 'autumn' && 'Perfect weather! Explore outdoor tips and photography spots.'}
                  {currentSeason === 'winter' && 'Peak season! Get tips on street food, festivals, and avoiding crowds.'}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    setSelectedSeason(currentSeason);
                    setSortBy('season');
                  }}
                >
                  Show {getSeasonInfo(currentSeason).label} Tips
                </Button>
              </Card>
              
              {/* Popular Tags */}
              <Card>
                <h3 className="font-semibold text-slate-900 mb-4">Popular Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {['food', 'photography', 'morning', 'shopping', 'heritage', 'family', 'free', 'tips', 'local', 'peaceful'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-1 bg-slate-100 rounded-lg text-xs text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </Card>
              
              {/* Contribute */}
              <Card className="bg-slate-900 text-white">
                <h3 className="font-semibold mb-2">Share Your Experience</h3>
                <p className="text-sm text-slate-300 mb-4">
                  Visited a place recently? Help others with your insider tips!
                </p>
                <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                  <Plus className="w-4 h-4 mr-2" />
                  Add a Tip
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsPage;
