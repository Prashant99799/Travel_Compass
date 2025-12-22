import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PageContainer } from '../components/layout/PageContainer.js';
import { Input } from '../components/common/Input.js';
import { Button } from '../components/common/Button.js';
import { Loader } from '../components/common/Loader.js';
import { RecommendationCard } from '../components/recommendations/RecommendationCard.js';
import { SearchParams, Recommendation } from '../types/index.js';
import { api } from '../services/api.js';
import { getCurrentSeason } from '../utils/seasonDetector.js';
import { Search } from 'lucide-react';

export const SearchPage: React.FC = () => {
  const [params, setParams] = useState<SearchParams>({
    season: getCurrentSeason(),
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const results = await api.getRecommendations(params);
      setRecommendations(results);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Find Your Perfect Destination
          </h1>
          <p className="text-gray-300 text-lg">
            Tell us what you're looking for, and we'll find the best places for you
          </p>
        </div>

        {/* Search Form */}
        <motion.form
          onSubmit={handleSearch}
          className="glass-strong rounded-2xl p-8 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Input
              label="Number of Days"
              type="number"
              min="1"
              max="30"
              placeholder="e.g., 3"
              value={params.days || ''}
              onChange={(e) =>
                setParams({ ...params, days: parseInt(e.target.value) || undefined })
              }
              icon={<span>📅</span>}
            />
            <Input
              label="Budget (₹)"
              type="number"
              min="0"
              placeholder="e.g., 5000"
              value={params.budget || ''}
              onChange={(e) =>
                setParams({
                  ...params,
                  budget: parseInt(e.target.value) || undefined,
                })
              }
              icon={<span>💰</span>}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Travel Type
              </label>
              <select
                value={params.travelType || 'solo'}
                onChange={(e) =>
                  setParams({
                    ...params,
                    travelType: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="solo">Solo</option>
                <option value="couple">Couple</option>
                <option value="family">Family</option>
                <option value="group">Group</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Season
              </label>
              <select
                value={params.season || 'winter'}
                onChange={(e) =>
                  setParams({
                    ...params,
                    season: e.target.value as any,
                  })
                }
                className="w-full px-4 py-2 rounded-lg glass text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="summer">Summer ☀️</option>
                <option value="monsoon">Monsoon 🌧️</option>
                <option value="autumn">Autumn 🍂</option>
                <option value="winter">Winter ❄️</option>
              </select>
            </div>
          </div>

          <Button
            type="submit"
            fullWidth
            size="lg"
            loading={loading}
            icon={<Search size={20} />}
          >
            Search Recommendations
          </Button>
        </motion.form>

        {/* Results */}
        {loading && <Loader fullScreen />}

        {searched && !loading && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">
              {recommendations.length} Places Recommended
            </h2>

            {recommendations.length === 0 ? (
              <div className="text-center text-gray-400 py-12">
                <p>No recommendations found. Try adjusting your preferences.</p>
              </div>
            ) : (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ staggerChildren: 0.1 }}
              >
                {recommendations.map((rec) => (
                  <motion.div
                    key={rec.destination.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <RecommendationCard
                      recommendation={rec}
                      onSelect={(id) => {
                        console.log('Selected:', id);
                      }}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        )}
      </div>
    </PageContainer>
  );
};
