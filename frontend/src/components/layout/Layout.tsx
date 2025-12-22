import React from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="pb-20 md:pb-0">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
