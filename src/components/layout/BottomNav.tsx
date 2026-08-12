import React from 'react';
import { CheckSquare, Calendar, BarChart2, Folder, Users, UserCheck, Flag, Columns } from 'lucide-react';
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
    { id: 'my-tasks', path: '/my-tasks', label: 'My Tasks', icon: UserCheck },
    { id: 'projects', path: '/projects', label: 'Projects', icon: Folder },
    { id: 'kanban', path: '/kanban', label: 'Kanban', icon: Columns },
    { id: 'milestones', path: '/milestones', label: 'Milestones', icon: Flag },
    { id: 'team', path: '/team', label: 'Team', icon: Users },
    { id: 'tasks', path: '/tasks', label: t('nav.tasks'), icon: CheckSquare },
    { id: 'calendar', path: '/calendar', label: t('nav.calendar'), icon: Calendar },
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
              onClick={() => navigate(item.path)}
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
