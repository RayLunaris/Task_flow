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
    <div className="min-h-screen flex font-sans bg-page-bg dark:bg-slate-950 pb-16 md:pb-0 transition-colors duration-300">
      <Sidebar />
      
      <div className="flex flex-col flex-1 w-full overflow-x-hidden">
        <Navbar />
        <main className="flex-1 px-6 py-8 w-full max-w-[1600px] mx-auto">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
};
