import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Compass, Map, Lightbulb, Star, ArrowRight, Sparkles } from 'lucide-react';
import { Button, Card, SeasonBadge, Input } from '../components/ui';
import { DestinationCard } from '../components/cards';
import { DESTINATIONS, TIPS } from '../data';
import { getCurrentSeason, getGreeting, rankDestinations, getSeasonInfo } from '../utils';

export const HomePage: React.FC = () => {
  const currentSeason = getCurrentSeason();
  const seasonInfo = getSeasonInfo(currentSeason);
  const greeting = getGreeting();
  
  // Get top destinations for current season
  const topDestinations = useMemo(() => {
    const ranked = rankDestinations(DESTINATIONS, {
      season: currentSeason,
      travelType: 'solo'
    });
    return ranked.slice(0, 4);
  }, [currentSeason]);
  
  // Get top tips sorted by upvotes
  const topTips = useMemo(() => {
    return [...TIPS]
      .sort((a, b) => b.upvotes - a.upvotes)
      .slice(0, 3);
  }, []);
  
  const features = [
    {
      icon: Sparkles,
      title: 'ML-Powered Rankings',
      description: 'Smart destination recommendations based on season, budget, and your travel style.'
    },
    {
      icon: Map,
      title: 'Seasonal Insights',
      description: 'Know the best time to visit each place with real-time season detection.'
    },
    {
      icon: Lightbulb,
      title: 'Local Tips',
      description: 'Discover insider tips from travelers who\'ve been there.'
    }
  ];
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1548013146-72479768bada?w=1920')] bg-cover bg-center opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24 lg:py-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-2 mb-4 sm:mb-6 flex-wrap">
              <SeasonBadge season={currentSeason} size="sm" />
              <span className="text-slate-400 hidden sm:inline">•</span>
              <span className="text-slate-300 text-sm sm:text-base">Perfect weather for exploring</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              {greeting}! <br />
              <span className="text-slate-300">Explore Ahmedabad</span>
            </h1>
            
            <p className="text-base sm:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl">
              Discover the best destinations, get personalized recommendations, 
              and find insider tips—all optimized for the current season.
            </p>
            
            {/* Search Bar */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
              <div className="flex-1">
                <Input
                  placeholder="Where do you want to go?"
                  leftIcon={<Search className="w-5 h-5" />}
                  className="bg-white/10 border-white/20 text-white placeholder-slate-400 focus:bg-white/20"
                />
              </div>
              <Link to="/search" className="w-full sm:w-auto">
                <Button variant="light" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  Explore
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-3 sm:mb-4">
              Smart Travel Planning
            </h2>
            <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
              Powered by machine learning to give you the best recommendations
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-6 h-6 text-slate-700" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Top Destinations */}
      <section className="py-10 sm:py-16 lg:py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                Top Picks for {seasonInfo.label}
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Best-rated destinations for this time of year
              </p>
            </div>
            <Link to="/search">
              <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {topDestinations.map((dest, index) => (
              <DestinationCard
                key={dest.destination.id}
                rankedDestination={dest}
                season={currentSeason}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>
      
      {/* Tips Section */}
      <section className="py-10 sm:py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-900 mb-1 sm:mb-2">
                Trending Tips
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                Most helpful advice from fellow travelers
              </p>
            </div>
            <Link to="/tips" className="self-start sm:self-auto">
              <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                All Tips
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {topTips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  <div className="flex items-center gap-3 mb-3">
                    <img
                      src={tip.userAvatar}
                      alt={tip.userName}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-slate-900">
                      {tip.userName}
                    </span>
                    {tip.season && <SeasonBadge season={tip.season} size="sm" />}
                  </div>
                  
                  <p className="text-sm text-slate-600 font-medium mb-2">
                    {tip.destinationName}
                  </p>
                  
                  <p className="text-slate-700 text-sm line-clamp-3 mb-3">
                    {tip.content}
                  </p>
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span>{tip.upvotes} helpful</span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-12 sm:py-16 lg:py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Compass className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-4 sm:mb-6 text-slate-400" />
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
              Ready to Explore?
            </h2>
            <p className="text-sm sm:text-base text-slate-400 mb-6 sm:mb-8 max-w-xl mx-auto px-4">
              Start planning your perfect Ahmedabad adventure with personalized recommendations.
            </p>
            <Link to="/search">
              <Button variant="light" size="lg" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Exploring
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
