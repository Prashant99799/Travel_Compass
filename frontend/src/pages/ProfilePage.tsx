import React from 'react';
import { PageContainer } from '../components/layout/PageContainer.js';
import { GlassCard } from '../components/common/GlassCard.js';
import { Button } from '../components/common/Button.js';
import { User, Mail, MapPin } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-white mb-8">Your Profile</h1>

        {/* User Info Card */}
        <GlassCard className="mb-8">
          <div className="flex items-start gap-6 mb-8">
            <div className="w-24 h-24 rounded-full bg-gradient-primary flex items-center justify-center text-white text-4xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white mb-2">John Doe</h2>
              <p className="text-gray-300 mb-4">Travel enthusiast & Ahmedabad explorer</p>
              <div className="space-y-2 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail size={16} />
                  <span>john@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} />
                  <span>Ahmedabad, India</span>
                </div>
              </div>
            </div>
          </div>

          <Button variant="outline" fullWidth>
            Edit Profile
          </Button>
        </GlassCard>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Tips Shared', value: '12', icon: '💡' },
            { label: 'Plans Created', value: '8', icon: '📋' },
            { label: 'Destinations', value: '5', icon: '🗺️' },
          ].map((stat, idx) => (
            <GlassCard key={idx} className="text-center">
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </GlassCard>
          ))}
        </div>

        {/* Preferences */}
        <GlassCard>
          <h3 className="text-xl font-bold text-white mb-4">Travel Preferences</h3>
          <div className="space-y-3">
            {[
              { label: 'Preferred Travel Type', value: 'Solo Travel' },
              { label: 'Favorite Season', value: 'Winter' },
              { label: 'Average Budget', value: '₹5,000 - ₹10,000' },
              { label: 'Interests', value: 'History, Culture, Food' },
            ].map((pref, idx) => (
              <div key={idx} className="flex justify-between items-center pb-3 border-b border-white/10 last:border-0">
                <span className="text-gray-400">{pref.label}</span>
                <span className="text-white font-semibold">{pref.value}</span>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </PageContainer>
  );
};
