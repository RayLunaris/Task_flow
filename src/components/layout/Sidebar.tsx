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
 <aside className="hidden md:flex flex-col w-[80px] bg-[#0F172A] h-screen py-8 items-center sticky top-0 transition-colors duration-300 z-20 shrink-0">
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
 'flex items-center justify-center w-full h-10 transition-all duration-200 border-l-[3px]',
 isActive
 ? 'text-[#FFFFFF] border-[#0D9488]'
 : 'text-[#94A3B8] border-transparent hover:text-[#FFFFFF]'
 )}
 >
 <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
 </button>
 );
 })}
 
 {user?.role === 'admin' && (
 <>
 <div className="w-8 h-[1px] bg-slate-800 my-2" />
 {adminItems.map((item) => {
 const Icon = item.icon;
 const isActive = currentView === item.id;
 return (
 <button
 key={item.id}
 onClick={() => navigate(item.path)}
 title={item.label}
 className={clsx(
 'flex items-center justify-center w-full h-10 transition-all duration-200 border-l-[3px]',
 isActive
 ? 'text-[#FFFFFF] border-[#0D9488]'
 : 'text-[#94A3B8] border-transparent hover:text-[#FFFFFF]'
 )}
 >
 <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
 </button>
 );
 })}
 </>
 )}
 </div>

 <div className="mt-auto pt-4 border-t border-slate-800 w-full flex justify-center">
 <button 
 onClick={() => navigate('/settings')}
 title={user?.name ? `${user.name} (${t('nav.settings')})` : t('nav.settings')}
 className="hover:ring-2 hover:ring-slate-700 rounded-full transition-all cursor-pointer focus:outline-none"
 >
 <Avatar name={user?.name || 'U'} src={user?.avatar} size="sm" />
 </button>
 </div>
 </aside>
 );
};
