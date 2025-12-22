import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PageContainer } from '../components/layout/PageContainer.js';
import { Button } from '../components/common/Button.js';
import { GlassCard } from '../components/common/GlassCard.js';
import { SeasonBadge } from '../components/common/SeasonBadge.js';
import { Loader } from '../components/common/Loader.js';
import { TipCard } from '../components/feed/TipCard.js';
import { getCurrentSeason, getSeasonInfo } from '../utils/seasonDetector.js';
import { api } from '../services/api.js';
import { Tip } from '../types/index.js';
import { Link } from 'react-router-dom';
import { ArrowRight, Zap, MapPin, Users } from 'lucide-react';

export const HomePage: React.FC = () => {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);
  const currentSeason = getCurrentSeason();
  const seasonInfo = getSeasonInfo(currentSeason);

  useEffect(() => {
    loadTrendingTips();
  }, []);

  const loadTrendingTips = async () => {
    try {
      const data = await api.getTrendingTips();
      setTips(data.slice(0, 3));
    } catch (error) {
      console.error('Error loading tips:', error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <PageContainer>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="text-center mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="mb-6">
            <SeasonBadge season={currentSeason} size="lg" showLabel />
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl font-bold text-white mb-4"
          >
            Discover Ahmedabad,
            <span className="gradient-text"> Season Smart</span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          >
            {seasonInfo.description} Get personalized travel recommendations
            based on weather, season, and your preferences.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/search">
              <Button size="lg" icon={<ArrowRight size={20} />}>
                Explore Now
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Learn More
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">
          Why Choose Compass?
        </h2>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {[
            {
              icon: <Zap className="w-8 h-8" />,
              title: 'AI-Powered',
              description: 'Smart recommendations based on ML models',
            },
            {
              icon: <MapPin className="w-8 h-8" />,
              title: 'Season-Aware',
              description: 'Perfect suggestions for current weather',
            },
            {
              icon: <Users className="w-8 h-8" />,
              title: 'Community',
              description: 'Tips and insights from locals',
            },
          ].map((feature, idx) => (
            <motion.div key={idx} variants={itemVariants}>
              <GlassCard hover className="h-full flex flex-col items-center text-center">
                <div className="text-purple-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-300">{feature.description}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Trending Tips */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
          Trending Tips
        </h2>

        {loading ? (
          <Loader />
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {tips.map((tip) => (
              <motion.div key={tip.id} variants={itemVariants}>
                <TipCard
                  tip={tip}
                  onVote={async (tipId, voteType) => {
                    try {
                      await api.voteTip(tipId, voteType);
                      loadTrendingTips();
                    } catch (error) {
                      console.error('Error voting:', error);
                    }
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <motion.div
          className="glass-strong rounded-2xl p-12 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to explore Ahmedabad?
          </h2>
          <p className="text-gray-300 mb-8">
            Get personalized travel recommendations in seconds
          </p>
          <Link to="/search">
            <Button size="lg">Start Exploring</Button>
          </Link>
        </motion.div>
      </section>
    </PageContainer>
  );
};
