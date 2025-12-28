import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-1 pb-24 md:pb-0">
        <Outlet />
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
