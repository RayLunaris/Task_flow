import React from 'react';
import { Calendar, BarChart2, UserCheck, Columns } from 'lucide-react';
import clsx from 'clsx';
import { useNavigate, useLocation } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.split('/')[1] || 'dashboard';

  const navItems = [
    { id: 'dashboard', path: '/dashboard', label: t('nav.dashboard'), icon: BarChart2 },
    { id: 'my-tasks', path: '/my-tasks', label: t('nav.myTasks'), icon: UserCheck },
    { id: 'kanban', path: '/kanban', label: t('nav.kanban'), icon: Columns },
    { id: 'calendar', path: '/calendar', label: t('nav.calendar'), icon: Calendar },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card-bg dark:bg-slate-900 border-t border-border-color pb-safe z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-[60px]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={clsx(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive ? 'text-primary' : 'text-muted hover:text-slate-700 dark:hover:text-slate-300'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
