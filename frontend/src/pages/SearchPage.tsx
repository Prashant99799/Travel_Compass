import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, IndianRupee, Calendar, Users, MapPin, SlidersHorizontal } from 'lucide-react';
import { Button, Card, Input, Select, SeasonBadge } from '../components/ui';
import { DestinationCard } from '../components/cards';
import { DESTINATIONS } from '../data';
import { Season, TravelType, SearchParams } from '../types';
import { 
  getCurrentSeason, 
  getSeasonInfo, 
  rankDestinations, 
  getCategories,
  formatCurrency,
  predictBudget
} from '../utils';

export const SearchPage: React.FC = () => {
  const currentSeason = getCurrentSeason();
  
  const [filters, setFilters] = useState<SearchParams>({
    season: currentSeason,
    budget: undefined,
    days: undefined,
    travelType: 'solo',
    categories: [],
    searchQuery: ''
  });
  
  const [showFilters, setShowFilters] = useState(false);
  
  const categories = useMemo(() => getCategories(DESTINATIONS), []);
  
  const rankedDestinations = useMemo(() => {
    return rankDestinations(DESTINATIONS, filters);
  }, [filters]);
  
  const budgetPrediction = useMemo(() => {
    if (rankedDestinations.length === 0) return null;
    const topDests = rankedDestinations.slice(0, 3).map(r => r.destination);
    return predictBudget(topDests, filters.days || 2, filters.travelType || 'solo');
  }, [rankedDestinations, filters.days, filters.travelType]);
  
  const updateFilter = <K extends keyof SearchParams>(key: K, value: SearchParams[K]) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const toggleCategory = (category: string) => {
    setFilters(prev => ({
      ...prev,
      categories: prev.categories?.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...(prev.categories || []), category]
    }));
  };
  
  const clearFilters = () => {
    setFilters({
      season: currentSeason,
      budget: undefined,
      days: undefined,
      travelType: 'solo',
      categories: [],
      searchQuery: ''
    });
  };
  
  const activeFiltersCount = [
    filters.budget,
    filters.days,
    filters.travelType !== 'solo',
    (filters.categories?.length || 0) > 0
  ].filter(Boolean).length;
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1">
              <Input
                placeholder="Search destinations..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter('searchQuery', e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
                rightIcon={
                  filters.searchQuery ? (
                    <button onClick={() => updateFilter('searchQuery', '')}>
                      <X className="w-4 h-4" />
                    </button>
                  ) : undefined
                }
              />
            </div>
            
            {/* Season Selector */}
            <div className="flex gap-2">
              {(['summer', 'monsoon', 'autumn', 'winter'] as Season[]).map((s) => {
                const info = getSeasonInfo(s);
                const isActive = filters.season === s;
                return (
                  <button
                    key={s}
                    onClick={() => updateFilter('season', s)}
                    className={`
                      px-3 py-2 rounded-xl text-sm font-medium transition-all
                      ${isActive 
                        ? `${info.bgColor} ${info.color}` 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                    `}
                  >
                    {info.emoji} <span className="hidden sm:inline">{info.label}</span>
                  </button>
                );
              })}
            </div>
            
            {/* Filter Toggle */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              leftIcon={<SlidersHorizontal className="w-4 h-4" />}
            >
              Filters
              {activeFiltersCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 bg-slate-900 text-white text-xs rounded-full">
                  {activeFiltersCount}
                </span>
              )}
            </Button>
          </div>
          
          {/* Expanded Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Budget */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <IndianRupee className="w-4 h-4 inline mr-1" />
                        Max Budget
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 2000"
                        value={filters.budget || ''}
                        onChange={(e) => updateFilter('budget', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    
                    {/* Days */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        Days Available
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 3"
                        value={filters.days || ''}
                        onChange={(e) => updateFilter('days', e.target.value ? Number(e.target.value) : undefined)}
                      />
                    </div>
                    
                    {/* Travel Type */}
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        <Users className="w-4 h-4 inline mr-1" />
                        Travel Type
                      </label>
                      <Select
                        value={filters.travelType || 'solo'}
                        onChange={(e) => updateFilter('travelType', e.target.value as TravelType)}
                        options={[
                          { value: 'solo', label: 'Solo' },
                          { value: 'couple', label: 'Couple' },
                          { value: 'family', label: 'Family' },
                          { value: 'friends', label: 'Friends' }
                        ]}
                      />
                    </div>
                    
                    {/* Clear Button */}
                    <div className="flex items-end">
                      <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="w-full"
                      >
                        Clear All
                      </Button>
                    </div>
                  </div>
                  
                  {/* Categories */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => toggleCategory(category)}
                          className={`
                            px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                            ${filters.categories?.includes(category)
                              ? 'bg-slate-900 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                          `}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Results */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {rankedDestinations.length} Destinations
                </h1>
                <p className="text-slate-600">
                  Ranked for {getSeasonInfo(filters.season).label.toLowerCase()} travel
                </p>
              </div>
              
              <SeasonBadge season={filters.season} />
            </div>
            
            {/* Results Grid */}
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {rankedDestinations.map((dest, index) => (
                <DestinationCard
                  key={dest.destination.id}
                  rankedDestination={dest}
                  season={filters.season}
                  index={index}
                />
              ))}
            </div>
            
            {rankedDestinations.length === 0 && (
              <Card className="text-center py-12">
                <Search className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No destinations found
                </h3>
                <p className="text-slate-600 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </Card>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:w-80">
            <div className="sticky top-36 space-y-6">
              {/* Budget Prediction Card */}
              {budgetPrediction && (
                <Card>
                  <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <IndianRupee className="w-5 h-5" />
                    Budget Estimate
                  </h3>
                  <p className="text-sm text-slate-600 mb-4">
                    For {filters.travelType || 'solo'} trip, {filters.days || 2} day(s)
                  </p>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Minimum</span>
                      <span className="font-medium">{formatCurrency(budgetPrediction.min)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Average</span>
                      <span className="font-semibold text-slate-900">{formatCurrency(budgetPrediction.avg)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Comfortable</span>
                      <span className="font-medium">{formatCurrency(budgetPrediction.max)}</span>
                    </div>
                  </div>
                </Card>
              )}
              
              {/* Season Info Card */}
              <Card>
                <h3 className="font-semibold text-slate-900 mb-4">
                  {getSeasonInfo(filters.season).emoji} {getSeasonInfo(filters.season).label} Travel
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  {filters.season === 'summer' && 'Hot weather (35-42°C). Best for indoor attractions, early morning visits, and water activities.'}
                  {filters.season === 'monsoon' && 'Rainy season (28-32°C). Lakes fill up beautifully. Some outdoor activities may be limited.'}
                  {filters.season === 'autumn' && 'Pleasant weather (25-32°C). Great for all outdoor activities and sightseeing.'}
                  {filters.season === 'winter' && 'Cool and comfortable (15-25°C). Peak season - ideal for all activities and street food.'}
                </p>
                <div className="text-xs text-slate-500">
                  Destinations are ranked based on seasonal suitability
                </div>
              </Card>
              
              {/* Quick Stats */}
              <Card>
                <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Total destinations</span>
                    <span className="font-medium">{DESTINATIONS.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Excellent matches</span>
                    <span className="font-medium text-emerald-600">
                      {rankedDestinations.filter(d => d.matchQuality === 'excellent').length}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Good matches</span>
                    <span className="font-medium text-blue-600">
                      {rankedDestinations.filter(d => d.matchQuality === 'good').length}
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
