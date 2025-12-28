import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  X, 
  IndianRupee, 
  Calendar, 
  Users, 
  MapPin, 
  SlidersHorizontal,
  Utensils,
  ShoppingBag,
  Camera,
  Landmark,
  TreePine,
  Clock,
  CalendarClock,
  Sparkles
} from 'lucide-react';
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

// Category icons mapping
const categoryIcons: Record<string, React.ElementType> = {
  'Historical': Landmark,
  'Religious': Sparkles,
  'Nature': TreePine,
  'Food': Utensils,
  'Shopping': ShoppingBag,
  'Architecture': Camera,
  'Cultural': Landmark,
  'Lake': TreePine,
  'Museum': Camera,
  'Modern': Camera,
  'default': MapPin
};

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
  const [planningNextSeason, setPlanningNextSeason] = useState(false);
  
  const categories = useMemo(() => getCategories(DESTINATIONS), []);
  
  // Get next season
  const getNextSeason = (current: Season): Season => {
    const order: Season[] = ['winter', 'summer', 'monsoon', 'autumn'];
    const currentIndex = order.indexOf(current);
    return order[(currentIndex + 1) % 4];
  };
  
  const nextSeason = getNextSeason(currentSeason);
  
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
    setPlanningNextSeason(false);
  };
  
  const handlePlanNextSeason = () => {
    setPlanningNextSeason(true);
    updateFilter('season', nextSeason);
  };
  
  const activeFiltersCount = [
    filters.budget,
    filters.days,
    filters.travelType !== 'solo',
    (filters.categories?.length || 0) > 0,
    filters.searchQuery
  ].filter(Boolean).length;
  
  // Quick category filters
  const quickCategories = [
    { key: 'Food', icon: Utensils, label: 'Food & Dining' },
    { key: 'Shopping', icon: ShoppingBag, label: 'Shopping' },
    { key: 'Historical', icon: Landmark, label: 'Historical' },
    { key: 'Nature', icon: TreePine, label: 'Nature' },
    { key: 'Religious', icon: Sparkles, label: 'Religious' },
  ];
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search Input */}
              <div className="flex-1">
                <Input
                  placeholder="Search by name (e.g., Sabarmati, Kankaria, Teen Darwaza)..."
                  value={filters.searchQuery}
                  onChange={(e) => updateFilter('searchQuery', e.target.value)}
                  leftIcon={<Search className="w-5 h-5" />}
                  rightIcon={
                    filters.searchQuery ? (
                      <button 
                        onClick={() => updateFilter('searchQuery', '')}
                        className="hover:bg-slate-100 p-1 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    ) : undefined
                  }
                />
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
            
            {/* Quick Category Filters */}
            <div className="flex flex-wrap gap-2">
              {quickCategories.map(({ key, icon: Icon, label }) => {
                const isActive = filters.categories?.includes(key);
                return (
                  <motion.button
                    key={key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleCategory(key)}
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all
                      ${isActive 
                        ? 'bg-slate-900 text-white shadow-sm' 
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </motion.button>
                );
              })}
            </div>
            
            {/* Season Selector */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-slate-500 mr-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Season:
              </span>
              {(['summer', 'monsoon', 'autumn', 'winter'] as Season[]).map((s) => {
                const info = getSeasonInfo(s);
                const isActive = filters.season === s;
                const isCurrent = s === currentSeason;
                return (
                  <motion.button
                    key={s}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      updateFilter('season', s);
                      setPlanningNextSeason(s !== currentSeason);
                    }}
                    className={`
                      px-3 py-2 rounded-xl text-sm font-medium transition-all relative
                      ${isActive 
                        ? `${info.bgColor} ${info.color} ring-2 ring-offset-2 ring-slate-300` 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}
                    `}
                  >
                    {info.emoji} {info.label}
                    {isCurrent && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-emerald-500 rounded-full" />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
          
          {/* Plan Next Season Banner */}
          <AnimatePresence>
            {!planningNextSeason && filters.season === currentSeason && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                        <CalendarClock className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">Plan for Next Season?</p>
                        <p className="text-sm text-slate-600">
                          See the best places to visit in {getSeasonInfo(nextSeason).label.toLowerCase()}
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={handlePlanNextSeason}
                      rightIcon={<SeasonBadge season={nextSeason} size="sm" showLabel={false} />}
                    >
                      Plan for {getSeasonInfo(nextSeason).label}
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Planning Next Season Indicator */}
          <AnimatePresence>
            {planningNextSeason && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 p-4 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl border border-violet-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-violet-100 rounded-xl flex items-center justify-center">
                        <CalendarClock className="w-5 h-5 text-violet-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900">
                          Planning for {getSeasonInfo(filters.season).emoji} {getSeasonInfo(filters.season).label}
                        </p>
                        <p className="text-sm text-slate-600">
                          Showing destinations optimized for future travel
                        </p>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => {
                        setPlanningNextSeason(false);
                        updateFilter('season', currentSeason);
                      }}
                    >
                      Back to Current
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
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
                  
                  {/* All Categories */}
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      <MapPin className="w-4 h-4 inline mr-1" />
                      All Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => {
                        const Icon = categoryIcons[category] || categoryIcons.default;
                        const isActive = filters.categories?.includes(category);
                        return (
                          <motion.button
                            key={category}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => toggleCategory(category)}
                            className={`
                              flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all
                              ${isActive
                                ? 'bg-slate-900 text-white'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}
                            `}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {category}
                          </motion.button>
                        );
                      })}
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
                  {filters.searchQuery ? (
                    <>Matching "{filters.searchQuery}" • </>
                  ) : null}
                  {filters.categories?.length ? (
                    <>{filters.categories.join(', ')} • </>
                  ) : null}
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                      <IndianRupee className="w-5 h-5" />
                      Budget Estimate
                    </h3>
                    <p className="text-sm text-slate-600 mb-4">
                      For {filters.travelType || 'solo'} trip, {filters.days || 2} day(s)
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="text-slate-600">Minimum</span>
                        <span className="font-medium">{formatCurrency(budgetPrediction.min)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-slate-50 rounded-lg">
                        <span className="text-slate-600">Average</span>
                        <span className="font-semibold text-slate-900">{formatCurrency(budgetPrediction.avg)}</span>
                      </div>
                      <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                        <span className="text-slate-600">Comfortable</span>
                        <span className="font-medium">{formatCurrency(budgetPrediction.max)}</span>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              )}
              
              {/* Season Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="hover:shadow-md transition-shadow">
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
              </motion.div>
              
              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="text-slate-600">Total destinations</span>
                      <span className="font-medium">{DESTINATIONS.length}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="text-slate-600">Excellent matches</span>
                      <span className="font-medium text-emerald-600">
                        {rankedDestinations.filter(d => d.matchQuality === 'excellent').length}
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 rounded-lg hover:bg-slate-50 transition-colors">
                      <span className="text-slate-600">Good matches</span>
                      <span className="font-medium text-blue-600">
                        {rankedDestinations.filter(d => d.matchQuality === 'good').length}
                      </span>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
