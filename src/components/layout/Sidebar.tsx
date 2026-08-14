import React from 'react';
import { Calendar, BarChart2, Folder, Users, UserCheck, Flag, Columns, Settings, Shield, PieChart, FileText } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { Avatar } from '../ui/Avatar';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const currentView = location.pathname.split('/')[1] || 'dashboard';

  const navItems = [
    { id: 'dashboard', path: '/dashboard', label: t('nav.dashboard'), icon: BarChart2 },
    { id: 'my-tasks', path: '/my-tasks', label: t('nav.myTasks'), icon: UserCheck },
    { id: 'projects', path: '/projects', label: t('nav.projects'), icon: Folder },
    { id: 'kanban', path: '/kanban', label: t('nav.kanban'), icon: Columns },
    { id: 'milestones', path: '/milestones', label: t('nav.milestones'), icon: Flag },
    { id: 'team', path: '/team', label: t('nav.team'), icon: Users },
    { id: 'calendar', path: '/calendar', label: t('nav.calendar'), icon: Calendar },
    { id: 'analytics', path: '/analytics', label: t('nav.analytics'), icon: PieChart },
    { id: 'report', path: '/report', label: t('nav.report'), icon: FileText },
    { id: 'settings', path: '/settings', label: t('nav.settings'), icon: Settings },
  ] as const;

  const adminItems = [
    { id: 'audit', path: '/audit', label: t('nav.audit'), icon: Shield },
  ] as const;

  return (
    <aside className="hidden md:flex flex-col w-[80px] bg-primary h-screen py-8 items-center sticky top-0 rounded-r-[32px] shadow-[4px_0_24px_rgba(107,90,237,0.2)] transition-colors duration-300 z-20 shrink-0">
      <div className="flex-1 w-full flex flex-col items-center space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={clsx(
                'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-white text-primary shadow-md'
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </button>
          );
        })}
        
        {user?.role === 'admin' && (
          <>
            <div className="w-8 h-[1px] bg-white/10 my-2" />
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                  className={clsx(
                    'flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200',
                    isActive
                      ? 'bg-white text-primary shadow-md'
                      : 'text-white/70 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </button>
              );
            })}
          </>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-white/10 w-full flex justify-center">
        <button title={user?.name} className="hover:ring-2 hover:ring-primary hover:ring-offset-2 hover:ring-offset-navy rounded-full transition-all">
          <Avatar name={user?.name || 'U'} size="sm" />
        </button>
      </div>
    </aside>
  );
};
