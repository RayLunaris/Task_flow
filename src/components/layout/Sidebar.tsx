import React from 'react';
import { Calendar, BarChart2, Folder, Users, UserCheck, Flag, Columns, Settings, Shield, PieChart, FileText, Command } from 'lucide-react';
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
    <aside className="hidden md:flex flex-col w-[240px] bg-[#0F172A] h-screen py-6 sticky top-0 transition-colors duration-300 z-20 shrink-0">
      <div className="flex items-center gap-3 mb-8 px-6">
        <Command size={24} className="text-[#0D9488]" strokeWidth={2.5} />
        <span className="font-bold text-[#F1F5F9] text-xl tracking-tight">TaskFlow</span>
      </div>

      <div className="flex-1 w-full flex flex-col items-start space-y-1 px-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              title={item.label}
              className={clsx(
                'flex items-center justify-start w-full h-10 px-3 transition-all duration-200 rounded-md relative',
                isActive
                  ? 'text-[#FFFFFF] bg-[#0D9488]/10'
                  : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-slate-800/50'
              )}
            >
              <div className={clsx("absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#0D9488] rounded-r-md transition-opacity duration-200", isActive ? "opacity-100" : "opacity-0")} />
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="mr-3" />
              <span className={clsx("text-sm font-medium", isActive ? "text-[#FFFFFF]" : "")}>{item.label}</span>
            </button>
          );
        })}
        
        {user?.role === 'admin' && (
          <>
            <div className="w-full h-[1px] bg-slate-800/50 my-3" />
            {adminItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => navigate(item.path)}
                  title={item.label}
                  className={clsx(
                    'flex items-center justify-start w-full h-10 px-3 transition-all duration-200 rounded-md relative',
                    isActive
                      ? 'text-[#FFFFFF] bg-[#0D9488]/10'
                      : 'text-[#94A3B8] hover:text-[#FFFFFF] hover:bg-slate-800/50'
                  )}
                >
                  <div className={clsx("absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-6 bg-[#0D9488] rounded-r-md transition-opacity duration-200", isActive ? "opacity-100" : "opacity-0")} />
                  <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="mr-3" />
                  <span className={clsx("text-sm font-medium", isActive ? "text-[#FFFFFF]" : "")}>{item.label}</span>
                </button>
              );
            })}
          </>
        )}
      </div>

      <div className="mt-auto pt-4 border-t border-slate-800/50 w-full flex items-center px-6">
        <button 
          onClick={() => navigate('/settings')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer w-full text-left"
        >
          <Avatar name={user?.name || 'U'} src={user?.avatar} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[#F1F5F9] truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-[#64748B] truncate capitalize">{user?.role || 'member'}</p>
          </div>
        </button>
      </div>
    </aside>
  );
};
