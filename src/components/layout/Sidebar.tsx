import React, { useState } from 'react';
import { Calendar, BarChart2, Plus, X, Folder, Users, UserCheck, Flag, Columns, Settings, Shield, PieChart, FileText } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '../../context/AuthContext';
import { useTasks } from '../../hooks/useTasks';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';

export const Sidebar: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, addCategory } = useTasks();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#2563EB'); // Default blue

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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim(), newCategoryColor);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  return (
    <aside className="hidden md:flex flex-col w-64 border-r border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 h-[calc(100vh-4rem)] p-4 sticky top-16 overflow-y-auto custom-scrollbar transition-colors duration-300">
      <div className="space-y-1">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">{t('sidebar.menu')}</h3>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
        {user?.role === 'admin' && adminItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 font-medium text-sm',
                isActive
                  ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
              )}
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-8 space-y-1">
        <div className="flex items-center justify-between mb-3 px-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('sidebar.categories')}</h3>
          <button 
            onClick={() => setIsAddingCategory(!isAddingCategory)}
            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title={t('sidebar.addCategory')}
          >
            {isAddingCategory ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            navigate('/my-tasks');
          }}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium',
            selectedCategory === null && currentView === 'my-tasks'
              ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          )}
        >
          <div className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          {t('common.all')}
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.name);
              navigate('/my-tasks');
            }}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium',
              selectedCategory === cat.name && currentView === 'my-tasks'
                ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
            )}
          >
            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
            <span className="truncate">{cat.name}</span>
          </button>
        ))}

        {isAddingCategory && (
          <form onSubmit={handleAddCategory} className="px-2 mt-3 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 p-2 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
              <input
                type="color"
                value={newCategoryColor}
                onChange={(e) => setNewCategoryColor(e.target.value)}
                className="w-6 h-6 p-0 border-0 rounded-md cursor-pointer flex-shrink-0 bg-transparent"
                title="Category Color"
              />
              <input
                type="text"
                placeholder={`${t('sidebar.categoryName')}...`}
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 min-w-0 text-sm bg-transparent border-none focus:ring-0 p-0 outline-none text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={!newCategoryName.trim()}
              className="mt-2 w-full text-xs font-medium bg-blue-50 border border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-colors"
            >
              {t('common.save')}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
