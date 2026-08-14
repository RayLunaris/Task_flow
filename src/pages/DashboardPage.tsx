import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { 
  QuickActions, 
  RecentNotifications, 
  TodayTasksWidget, 
  ProjectStatsWidget
} from '../components/dashboard/DashboardWidgets';
import { AssignedTasksWidget, MiniCalendarWidget } from '../components/dashboard/DashboardMoreWidgets';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-10 flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-1">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-navy dark:text-slate-50 mb-3 leading-tight max-w-md">
            {t('dashboard.welcomeHeading', { name: user?.name?.split(' ')[0] || 'User' })} <br />
            <span className="text-primary">{t('dashboard.welcomeSubheading')}</span>
          </h1>
          <p className="text-muted text-sm max-w-sm">
            {t('dashboard.welcomeDesc')}
          </p>
        </div>
        <div className="w-full md:w-auto">
          <QuickActions />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kolom Kiri & Tengah (8 kolom) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecentNotifications />
            <AssignedTasksWidget />
          </div>
          
          <TodayTasksWidget />
        </div>

        {/* Kolom Kanan (4 kolom) */}
        <div className="lg:col-span-4 space-y-6">
          <MiniCalendarWidget />
          <ProjectStatsWidget />
        </div>
      </div>
    </div>
  );
};
