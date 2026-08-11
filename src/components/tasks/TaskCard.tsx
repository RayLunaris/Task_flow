import React from 'react';
import { Trash2, Edit2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Task } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { Badge } from '../ui/Badge';
import { getDueDateStatus } from '../../utils/dateUtils';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const { toggleTaskCompletion, deleteTask } = useTasks();
  const dueDateStatus = getDueDateStatus(task.dueDate);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={clsx(
        'group flex items-start gap-4 p-4 rounded-2xl border transition-all duration-300',
        task.completed
          ? 'bg-slate-50 border-slate-200'
          : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-purple-200'
      )}
    >
      <button
        onClick={() => toggleTaskCompletion(task.id)}
        className={clsx(
          'mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors flex-shrink-0',
          task.completed
            ? 'bg-purple-500 border-purple-500 text-white'
            : 'border-slate-300 hover:border-purple-400 text-transparent'
        )}
      >
        <Check size={14} className={task.completed ? 'opacity-100' : 'opacity-0'} strokeWidth={3} />
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={clsx(
            'text-lg font-semibold truncate transition-colors',
            task.completed ? 'text-slate-400 line-through' : 'text-slate-800'
          )}
        >
          {task.title}
        </h3>
        {task.description && (
          <p
            className={clsx(
              'mt-1 text-sm line-clamp-2 transition-colors',
              task.completed ? 'text-slate-400 line-through' : 'text-slate-500'
            )}
          >
            {task.description}
          </p>
        )}
        
        <div className="mt-3 flex flex-wrap gap-2">
          {task.priority === 'high' && <Badge variant="priority-high">🔴 High</Badge>}
          {task.priority === 'medium' && <Badge variant="priority-medium">🟡 Medium</Badge>}
          {task.priority === 'low' && <Badge variant="priority-low">🟢 Low</Badge>}
          <Badge variant="category">{task.category}</Badge>
          {dueDateStatus && (
            <Badge variant={`due-${dueDateStatus.color}` as any}>
              {dueDateStatus.color === 'red' ? '🔴' : dueDateStatus.color === 'yellow' ? '🟡' : '⚪'} {dueDateStatus.label}
            </Badge>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
          title="Edit Task"
        >
          <Edit2 size={16} />
        </button>
        <button
          onClick={() => deleteTask(task.id)}
          className="p-2 text-slate-400 hover:text-pink-500 hover:bg-pink-50 rounded-lg transition-colors"
          title="Delete Task"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
};
