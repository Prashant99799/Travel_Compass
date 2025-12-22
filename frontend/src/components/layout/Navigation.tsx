import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="glass fixed w-full top-0 z-40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <Compass className="w-8 h-8 text-purple-400 group-hover:text-purple-300" />
            <span className="text-xl font-bold gradient-text">Compass</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-white/70 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/search"
              className="text-white/70 hover:text-white transition-colors"
            >
              Explore
            </Link>
            <Link
              to="/tips"
              className="text-white/70 hover:text-white transition-colors"
            >
              Tips
            </Link>
            <Link
              to="/profile"
              className="btn-primary text-sm"
            >
              Profile
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link
              to="/"
              className="block px-4 py-2 text-white/70 hover:text-white"
            >
              Home
            </Link>
            <Link
              to="/search"
              className="block px-4 py-2 text-white/70 hover:text-white"
            >
              Explore
            </Link>
            <Link
              to="/tips"
              className="block px-4 py-2 text-white/70 hover:text-white"
            >
              Tips
            </Link>
            <Link
              to="/profile"
              className="block px-4 py-2 btn-primary text-center text-sm"
            >
              Profile
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
