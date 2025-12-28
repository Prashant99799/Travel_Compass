import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Compass, Search, Lightbulb, User, LogIn, LogOut, MessageSquare } from 'lucide-react';
import { useAuth } from '../../context';
import { SeasonBadge, Button } from '../ui';
import { getCurrentSeason } from '../../utils';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentSeason = getCurrentSeason();
  const { user, isAuthenticated, logout } = useAuth();
  
  const navItems = [
    { path: '/', label: 'Home', icon: Compass },
    { path: '/search', label: 'Explore', icon: Search },
    { path: '/posts', label: 'Posts', icon: MessageSquare },
    { path: '/tips', label: 'Tips', icon: Lightbulb },
    { path: '/profile', label: 'Profile', icon: User, requiresAuth: true },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold text-slate-900">Compass</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              // Skip auth-required items for non-authenticated users
              if (item.requiresAuth && !isAuthenticated) return null;
              
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="relative px-4 py-2 rounded-lg group"
                >
                  <span className={`
                    flex items-center gap-2 text-sm font-medium transition-colors
                    ${isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-slate-900'}
                  `}>
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110" />
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
          
          {/* Right Side */}
          <div className="hidden sm:flex items-center gap-3">
            <SeasonBadge season={currentSeason} />
            
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link 
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      className="w-9 h-9 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-medium text-sm">
                      {getInitials(user.name)}
                    </div>
                  )}
                </Link>
                <button 
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login">
                <Button size="sm" leftIcon={<LogIn className="w-4 h-4" />}>
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          
          {/* Mobile Right Side */}
          <div className="flex md:hidden items-center gap-2">
            <SeasonBadge season={currentSeason} size="sm" showLabel={false} />
            {isAuthenticated && user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile">
                  {user.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full object-cover border-2 border-slate-200"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-medium text-xs">
                      {getInitials(user.name)}
                    </div>
                  )}
                </Link>
              </div>
            ) : (
              <Link to="/login">
                <LogIn className="w-5 h-5 text-slate-600" />
              </Link>
            )}
          </div>
        </div>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 px-4 py-2 z-50">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            // For mobile, show profile only if authenticated, otherwise show login
            if (item.requiresAuth && !isAuthenticated) {
              return (
                <Link
                  key="login"
                  to="/login"
                  className="flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all text-slate-400"
                >
                  <LogIn className="w-5 h-5" />
                  <span className="text-xs font-medium">Sign In</span>
                </Link>
              );
            }
            
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-all
                  ${isActive ? 'text-slate-900' : 'text-slate-400'}
                `}
              >
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
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
