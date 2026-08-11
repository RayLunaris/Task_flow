import React from 'react';
import { CheckSquare, Calendar, BarChart2 } from 'lucide-react';
import clsx from 'clsx';

import { useTranslation } from 'react-i18next';

interface BottomNavProps {
  currentView: 'tasks' | 'calendar' | 'dashboard';
  onChangeView: (view: 'tasks' | 'calendar' | 'dashboard') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentView, onChangeView }) => {
  const { t } = useTranslation();

  const navItems = [
    { id: 'tasks', label: t('nav.tasks'), icon: CheckSquare },
    { id: 'calendar', label: t('nav.calendar'), icon: Calendar },
    { id: 'dashboard', label: t('nav.dashboard'), icon: BarChart2 },
  ] as const;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pb-safe z-50 transition-colors duration-300">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={clsx(
                'flex flex-col items-center justify-center w-full h-full gap-1 transition-colors',
                isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300'
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
