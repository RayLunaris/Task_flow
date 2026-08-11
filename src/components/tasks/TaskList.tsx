import React, { useMemo } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from './TaskCard';

export const TaskList: React.FC = () => {
  const { tasks, selectedCategory, filterStatus, filterPriority, filterDueDate, sortBy, sortOrder } = useTasks();

  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    // 1. Filter by Category
    if (selectedCategory) {
      result = result.filter(task => task.category === selectedCategory);
    }

    // 2. Filter by Status
    if (filterStatus !== 'all') {
      result = result.filter(task => 
        filterStatus === 'completed' ? task.completed : !task.completed
      );
    }

    // 3. Filter by Priority
    if (filterPriority !== 'all') {
      result = result.filter(task => task.priority === filterPriority);
    }

    // 4. Filter by Due Date
    if (filterDueDate !== 'all') {
      result = result.filter(task => {
        if (!task.dueDate) return false;
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const dueDay = new Date(task.dueDate);
        dueDay.setHours(0, 0, 0, 0);
        
        const diffTime = dueDay.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        if (filterDueDate === 'overdue') return diffDays < 0 && !task.completed;
        if (filterDueDate === 'today') return diffDays === 0;
        if (filterDueDate === 'week') return diffDays >= 0 && diffDays <= 7;
        
        return true;
      });
    }

    // 5. Sort
    result = [...result].sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'createdAt') {
        comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'dueDate') {
        const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
        const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
        comparison = dateA - dateB;
      } else if (sortBy === 'priority') {
        const priorityWeight = { high: 3, medium: 2, low: 1 };
        comparison = priorityWeight[a.priority] - priorityWeight[b.priority];
      } else if (sortBy === 'name') {
        comparison = a.title.localeCompare(b.title);
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [tasks, selectedCategory, filterStatus, filterPriority, filterDueDate, sortBy, sortOrder]);

  if (filteredAndSortedTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-purple-50 p-6 rounded-full mb-4">
          <ClipboardList size={48} className="text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No tasks found</h3>
        <p className="text-slate-500 max-w-sm">
          Try adjusting your filters, or add a new task!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {filteredAndSortedTasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
};

