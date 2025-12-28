import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Github, Instagram, Mail, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = {
    explore: [
      { label: 'Destinations', href: '/search' },
      { label: 'Tips & Guides', href: '/tips' },
      { label: 'Plan Trip', href: '/search?plan=true' },
      { label: 'Seasonal Picks', href: '/search' }
    ],
    company: [
      { label: 'About Us', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Careers', href: '/careers' },
      { label: 'Blog', href: '/blog' }
    ],
    support: [
      { label: 'Help Center', href: '/help' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'FAQ', href: '/faq' }
    ]
  };
  
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                <Compass className="w-6 h-6 text-slate-900" />
              </div>
              <span className="text-xl font-bold">Compass</span>
            </Link>
            <p className="text-slate-400 text-sm mb-6 max-w-xs">
              Your AI-powered travel companion for exploring Ahmedabad. 
              Season-aware recommendations and local insights.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://www.instagram.com/____.hardik.____?igsh=dGpvbHRnM3k0d3h2" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/Prashant99799" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
              <a 
                href="mailto:hardikbhadoriya1155@gmail.com" 
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white transition-all duration-200 hover:scale-110"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Explore Links */}
          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Company Links */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Support Links */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.label}>
                  <Link 
                    to={link.href}
                    className="text-slate-400 hover:text-white transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-400 text-sm">
            © {currentYear} Compass. All rights reserved.
          </p>
          <p className="text-slate-400 text-sm flex items-center gap-1">
            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Ahmedabad
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
