import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Search, Lightbulb, User } from 'lucide-react';
import { SeasonBadge } from '../ui';
import { getCurrentSeason } from '../../utils';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const currentSeason = getCurrentSeason();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/search', label: 'Explore', icon: Search },
    { path: '/tips', label: 'Tips', icon: Lightbulb },
    { path: '/profile', label: 'Profile', icon: User },
  ];
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Compass</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg"
                >
                  <span className={`
                    flex items-center gap-2 text-sm font-medium transition-colors
                    ${isActive ? 'text-slate-900' : 'text-slate-500 hover:text-slate-900'}
                  `}>
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-slate-100 rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
          
          {/* Season Badge */}
          <div className="hidden sm:flex items-center gap-3">
            <SeasonBadge season={currentSeason} />
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <SeasonBadge season={currentSeason} size="sm" showLabel={false} />
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors
                  ${isActive ? 'text-slate-900' : 'text-slate-400'}
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
