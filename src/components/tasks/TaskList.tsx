import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { ClipboardList } from 'lucide-react';
import { useTasks } from '../../hooks/useTasks';
import { TaskCard } from './TaskCard';

export const TaskList: React.FC = () => {
  const { tasks } = useTasks();

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="bg-purple-50 p-6 rounded-full mb-4">
          <ClipboardList size={48} className="text-purple-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-700 mb-2">No tasks yet</h3>
        <p className="text-slate-500 max-w-sm">
          You have a clean slate! Add a new task above to start organizing your day.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </AnimatePresence>
    </div>
  );
};
