import React from 'react';
import { Trash2, Check } from 'lucide-react';
import clsx from 'clsx';
import type { SubTask } from '../../types';

interface SubTaskItemProps {
  subTask: SubTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SubTaskItem: React.FC<SubTaskItemProps> = ({ subTask, onToggle, onDelete }) => {
  return (
    <div className="flex items-center gap-3 py-2 group">
      <button
        onClick={() => onToggle(subTask.id)}
        className={clsx(
          'w-5 h-5 rounded flex items-center justify-center transition-colors flex-shrink-0',
          subTask.completed
            ? 'bg-teal-500 text-white'
            : 'border-2 border-slate-300 hover:border-teal-400 text-transparent'
        )}
      >
        <Check size={14} className={subTask.completed ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
      </button>

      <span
        className={clsx(
          'flex-1 text-sm transition-colors',
          subTask.completed ? 'text-slate-400 line-through' : 'text-slate-700'
        )}
      >
        {subTask.title}
      </span>

      <button
        onClick={() => onDelete(subTask.id)}
        className="p-1.5 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title="Delete Sub-task"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
};
