import React from 'react';
import { motion } from 'framer-motion';
import { GamificationPanel } from '../components/dashboard/GamificationPanel';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { useTranslation } from 'react-i18next';

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <div className="space-y-8 pb-12">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50 mb-2">
          {t('nav.dashboard')}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Welcome back. Here's what's happening with your tasks today.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <GamificationPanel />
        </div>
        <div className="xl:col-span-2">
          <ProductivityChart />
        </div>
      </div>
    </div>
  );
};
