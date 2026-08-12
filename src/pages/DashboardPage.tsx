import React from 'react';
import { GamificationPanel } from '../components/dashboard/GamificationPanel';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';

export const DashboardPage: React.FC = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
      <GamificationPanel />
      <ProductivityChart />
    </div>
  );
};
