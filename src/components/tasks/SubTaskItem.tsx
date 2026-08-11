import React from 'react';
import { Trash2, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { SubTask } from '../../types';
import { useTranslation } from 'react-i18next';

interface SubTaskItemProps {
  subTask: SubTask;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export const SubTaskItem: React.FC<SubTaskItemProps> = ({ subTask, onToggle, onDelete }) => {
  const { t } = useTranslation();

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className="flex items-center gap-3 py-2 group"
    >
      <motion.button
        whileTap={{ scale: 0.8 }}
        onClick={() => onToggle(subTask.id)}
        className={clsx(
          'w-5 h-5 rounded flex items-center justify-center transition-colors flex-shrink-0',
          subTask.completed
            ? 'bg-teal-500 text-white border-teal-500'
            : 'border-2 border-slate-300 dark:border-slate-600 hover:border-teal-400 dark:hover:border-teal-500 text-transparent'
        )}
      >
        <motion.div
          initial={false}
          animate={{ scale: subTask.completed ? 1 : 0, opacity: subTask.completed ? 1 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          <Check size={14} strokeWidth={3} />
        </motion.div>
      </motion.button>

      <span
        className={clsx(
          'flex-1 text-sm transition-colors duration-300',
          subTask.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'
        )}
      >
        {subTask.title}
      </span>

      <button
        onClick={() => onDelete(subTask.id)}
        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
        title={t('common.delete')}
      >
        <Trash2 size={14} />
      </button>
    </motion.div>
  );
};
