import React from 'react';
import { motion } from 'framer-motion';
import { User, MapPin, Calendar, Star, Settings, Bookmark, Clock, TrendingUp } from 'lucide-react';
import { Button, Card, SeasonBadge } from '../components/ui';
import { TIPS, DESTINATIONS } from '../data';
import { getCurrentSeason, getSeasonInfo, formatDate } from '../utils';

export const ProfilePage: React.FC = () => {
  const currentSeason = getCurrentSeason();
  
  // Mock user data
  const user = {
    name: 'Guest User',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Guest',
    joinDate: '2024-01-01',
    tipsCount: 0,
    savedPlaces: 3,
    placesVisited: 5
  };
  
  // Mock saved destinations (first 3)
  const savedDestinations = DESTINATIONS.slice(0, 3);
  
  // Mock recent activity
  const recentActivity = TIPS.slice(0, 3);
  
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-2xl bg-slate-100 shadow-sm"
              />
              <div className="absolute -bottom-2 -right-2 p-1.5 bg-white rounded-lg shadow-sm">
                <SeasonBadge season={currentSeason} size="sm" showLabel={false} />
              </div>
            </motion.div>
            
            {/* Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-900 mb-1">{user.name}</h1>
              <div className="flex items-center gap-4 text-sm text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Joined {formatDate(user.joinDate)}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  Ahmedabad
                </span>
              </div>
            </div>
            
            {/* Actions */}
            <Button variant="outline" leftIcon={<Settings className="w-4 h-4" />}>
              Settings
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <Card padding="sm" className="text-center">
              <div className="text-2xl font-bold text-slate-900">{user.placesVisited}</div>
              <div className="text-sm text-slate-600">Places Visited</div>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="text-2xl font-bold text-slate-900">{user.savedPlaces}</div>
              <div className="text-sm text-slate-600">Saved Places</div>
            </Card>
            <Card padding="sm" className="text-center">
              <div className="text-2xl font-bold text-slate-900">{user.tipsCount}</div>
              <div className="text-sm text-slate-600">Tips Shared</div>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Saved Places */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Bookmark className="w-5 h-5" />
                  Saved Places
                </h2>
                <Button variant="ghost" size="sm">View All</Button>
              </div>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {savedDestinations.map((dest, index) => (
                  <motion.div
                    key={dest.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card hover padding="none" className="overflow-hidden">
                      <div className="flex">
                        <img
                          src={dest.imageUrl}
                          alt={dest.name}
                          className="w-24 h-24 object-cover"
                        />
                        <div className="p-3 flex-1">
                          <h3 className="font-medium text-slate-900 mb-1">{dest.name}</h3>
                          <p className="text-xs text-slate-500 mb-2">{dest.category}</p>
                          <SeasonBadge season={currentSeason} size="sm" />
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </section>
            
            {/* Recent Activity */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Recent Activity
                </h2>
              </div>
              
              <Card padding="none">
                <div className="divide-y divide-slate-100">
                  {recentActivity.map((tip, index) => (
                    <div key={tip.id} className="p-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <img
                          src={tip.userAvatar}
                          alt={tip.userName}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium text-slate-900">{tip.userName}</span>
                            <span className="text-slate-500"> shared a tip about </span>
                            <span className="font-medium text-slate-900">{tip.destinationName}</span>
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{formatDate(tip.createdAt)}</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-slate-500">
                          <TrendingUp className="w-4 h-4" />
                          {tip.upvotes}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Season Card */}
            <Card>
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${getSeasonInfo(currentSeason).bgColor} rounded-xl flex items-center justify-center text-2xl`}>
                  {getSeasonInfo(currentSeason).emoji}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">
                    {getSeasonInfo(currentSeason).label} Season
                  </h3>
                  <p className="text-sm text-slate-500">Current season</p>
                </div>
              </div>
              <p className="text-sm text-slate-600">
                {currentSeason === 'summer' && 'Beat the heat with indoor attractions and early morning visits!'}
                {currentSeason === 'monsoon' && 'Enjoy the rain and visit lakes at their best!'}
                {currentSeason === 'autumn' && 'Perfect weather for outdoor exploration!'}
                {currentSeason === 'winter' && 'Peak season - enjoy street food and festivals!'}
              </p>
            </Card>
            
            {/* Quick Actions */}
            <Card>
              <h3 className="font-semibold text-slate-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start" leftIcon={<MapPin className="w-4 h-4" />}>
                  Mark Place as Visited
                </Button>
                <Button variant="outline" className="w-full justify-start" leftIcon={<Star className="w-4 h-4" />}>
                  Write a Review
                </Button>
                <Button variant="outline" className="w-full justify-start" leftIcon={<Bookmark className="w-4 h-4" />}>
                  Create Trip Plan
                </Button>
              </div>
            </Card>
            
            {/* Sign In CTA */}
            <Card className="bg-slate-900 text-white">
              <h3 className="font-semibold mb-2">Create an Account</h3>
              <p className="text-sm text-slate-300 mb-4">
                Sign in to save your favorite places, share tips, and track your travels.
              </p>
              <Button className="w-full bg-white text-slate-900 hover:bg-slate-100">
                Sign In
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
