import React, { useState } from 'react';
import { CheckSquare, Calendar, BarChart2, Plus, X } from 'lucide-react';
import clsx from 'clsx';
import { useTasks } from '../../hooks/useTasks';
import { useTranslation } from 'react-i18next';

interface SidebarProps {
  currentView: 'tasks' | 'calendar' | 'dashboard';
  onChangeView: (view: 'tasks' | 'calendar' | 'dashboard') => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView }) => {
  const { categories, selectedCategory, setSelectedCategory, addCategory } = useTasks();
  const { t } = useTranslation();
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState('#7C3AED'); // Default purple

  const navItems = [
    { id: 'tasks', label: t('nav.tasks'), icon: CheckSquare },
    { id: 'calendar', label: t('nav.calendar'), icon: Calendar },
    { id: 'dashboard', label: t('nav.dashboard'), icon: BarChart2 },
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
              onClick={() => onChangeView(item.id)}
              className={clsx(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm',
                isActive
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
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
            className="text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
            title={t('sidebar.addCategory')}
          >
            {isAddingCategory ? <X size={14} /> : <Plus size={14} />}
          </button>
        </div>

        <button
          onClick={() => {
            setSelectedCategory(null);
            onChangeView('tasks');
          }}
          className={clsx(
            'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium',
            selectedCategory === null && currentView === 'tasks'
              ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
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
              onChangeView('tasks');
            }}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 text-sm font-medium',
              selectedCategory === cat.name && currentView === 'tasks'
                ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400'
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
              className="mt-2 w-full text-xs font-medium bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-purple-200 dark:hover:bg-purple-900/60 transition-colors"
            >
              {t('common.save')}
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};
