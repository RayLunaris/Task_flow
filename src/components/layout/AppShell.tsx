import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { BottomNav } from './BottomNav';
import { useAuth } from '../../context/AuthContext';

export const AppShell: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50/50 dark:bg-slate-950 pb-16 md:pb-0 transition-colors duration-300">
      <Navbar />
      
      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        <Sidebar />
        
        <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
