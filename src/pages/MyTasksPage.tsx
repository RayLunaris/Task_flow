import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../context/ProjectContext';
import { TaskCard } from '../components/tasks/TaskCard';
import { CheckSquare, Calendar, AlertCircle, ListTodo } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

type FilterType = 'all' | 'today' | 'week' | 'overdue' | 'completed';
type SortType = 'dueDate' | 'priority' | 'project';

export const MyTasksPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks } = useTasks();
  const { projects } = useProjects();
  
  const [filter, setFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('dueDate');

  const myTasks = useMemo(() => {
    if (!user) return [];
    
    // 1. Get user's tasks
    let filtered = tasks.filter(t => t.assigneeIds?.includes(user.id));

    // 2. Apply filter
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    filtered = filtered.filter(task => {
      if (filter === 'completed') return task.completed;
      if (task.completed) return false; // Default: hide completed unless explicitly requested

      if (filter === 'all') return true;

      if (!task.dueDate) return filter !== 'overdue'; // tasks without due date aren't overdue, but can be in 'all'

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
        return priorityWeight[b.priority] - priorityWeight[a.priority]; // Descending (Urgent first)
      }
      if (sortBy === 'project') {
        const projA = projects.find(p => p.id === a.projectId)?.name || 'ZZZ';
        const projB = projects.find(p => p.id === b.projectId)?.name || 'ZZZ';
        return projA.localeCompare(projB);
      }
      return 0;
    });

    return filtered;
  }, [tasks, user, filter, sortBy, projects]);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <CheckSquare className="text-purple-500" />
            My Tasks
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Tasks assigned specifically to you</p>
        </div>
      </div>

      {/* Filters & Sorting */}
      <div className="flex flex-col md:flex-row justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2">
          <FilterButton active={filter === 'all'} onClick={() => setFilter('all')} icon={<ListTodo size={14} />}>All Active</FilterButton>
          <FilterButton active={filter === 'today'} onClick={() => setFilter('today')} icon={<Calendar size={14} />}>Today</FilterButton>
          <FilterButton active={filter === 'week'} onClick={() => setFilter('week')} icon={<Calendar size={14} />}>This Week</FilterButton>
          <FilterButton active={filter === 'overdue'} onClick={() => setFilter('overdue')} icon={<AlertCircle size={14} />} color="text-pink-600 bg-pink-50 dark:bg-pink-900/30">Overdue</FilterButton>
          <FilterButton active={filter === 'completed'} onClick={() => setFilter('completed')} icon={<CheckSquare size={14} />}>Completed</FilterButton>
        </div>

        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
          <span className="font-medium">Sort by:</span>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value as SortType)}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-purple-200"
          >
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="project">Project</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {myTasks.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 mb-4">
            <CheckSquare size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">No tasks found</h3>
          <p className="text-slate-500">You don't have any tasks matching the current filters.</p>
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
      className={`px-3 py-1.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-colors ${
        active 
          ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-400' 
          : color || 'bg-slate-50 text-slate-600 hover:bg-slate-100 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700'
      }`}
    >
      {icon}
      {children}
    </button>
  );
};
