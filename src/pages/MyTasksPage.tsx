import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';

import { TaskCard } from '../components/tasks/TaskCard';
import { TaskForm } from '../components/tasks/TaskForm';
import { CheckSquare, Calendar, AlertCircle, ListTodo } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

type FilterType = 'all' | 'today' | 'week' | 'overdue' | 'completed';
type SortType = 'dueDate' | 'priority' | 'name';

export const MyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, selectedCategory } = useTasks();
  const { t } = useTranslation();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');

  const myTasks = useMemo(() => {
    if (!user) return [];
    
    // 1. Get user's tasks
    let filtered = tasks.filter(t => t.assigneeIds?.includes(user.id));

    // 1.5. Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(task => task.category === selectedCategory);
    }

    // 2. Apply filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filtered = filtered.filter(task => {
      if (filter === 'completed') return task.completed;
      if (task.completed) return false;

      if (filter === 'all') return true;

      if (!task.dueDate) return filter !== 'overdue';

      const dueDay = new Date(task.dueDate);
      dueDay.setHours(0, 0, 0, 0);
      const diffTime = dueDay.getTime() - today.getTime();
      const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

      if (filter === 'today') return diffDays === 0;
      if (filter === 'week') return diffDays >= 0 && diffDays <= 7;
      if (filter === 'overdue') return diffDays < 0;

      return true;
    });

    // 3. Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        return dateA - dateB;
      }
      if (sortBy === 'priority') {
        const priorityWeight = { urgent: 4, high: 3, medium: 2, low: 1 };
        return priorityWeight[b.priority] - priorityWeight[a.priority];
      }
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });

    return filtered;
  }, [tasks, user, filter, sortBy, selectedCategory]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-6 text-center sm:text-left">
        <h1 className="text-[26px] font-bold text-navy dark:text-slate-100 mb-1">
          {t('app.greeting', { name: user?.name?.split(' ')[0] || 'User' })}
        </h1>
        <p className="text-muted">{t('app.subtitle')}</p>
      </div>

      <TaskForm />

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-card-bg dark:bg-slate-900 p-4 rounded-[14px] border border-border-color dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} icon={<ListTodo size={14} />}>All Active</FilterButton>
          <FilterButton active={filter === 'today'} onClick={() => setFilter('today')} icon={<Calendar size={14} />}>Today</FilterButton>
          <FilterButton active={filter === 'week'} onClick={() => setFilter('week')} icon={<Calendar size={14} />}>This Week</FilterButton>
          <FilterButton active={filter === 'overdue'} onClick={() => setFilter('overdue')} icon={<AlertCircle size={14} />} color="text-danger bg-danger/10 border-danger/20 dark:bg-danger/20">Overdue</FilterButton>
          <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} icon={<CheckSquare size={14} />}>Completed</FilterButton>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="bg-white dark:bg-slate-800 border border-border-color dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {myTasks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-card-bg dark:bg-slate-900 rounded-[14px] border border-dashed border-border-color dark:border-slate-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
            <CheckSquare size={32} />
          </div>
          <h3 className="text-lg font-bold text-navy dark:text-slate-300 mb-2">No tasks found</h3>
          <p className="text-muted text-sm">You don't have any tasks matching the current filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {myTasks.map(task => (
              <TaskCard key={task.id} task={task} isDragEnabled={false} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

const FilterButton: React.FC<{ 
  active: boolean; 
  onClick: () => void; 
  children: React.ReactNode;
  icon?: React.ReactNode;
  color?: string;
}> = ({ active, onClick, children, icon, color }) => {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors border ${
        active 
          ? 'bg-primary text-white border-primary' 
          : color || 'bg-white text-slate-600 border-border-color hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      {children}
    </button>
  );
};
