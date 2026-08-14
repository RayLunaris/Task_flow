import React from 'react';
import { motion } from 'framer-motion';
import { Flag, Edit2, Trash2, Calendar } from 'lucide-react';
import clsx from 'clsx';
import type { Milestone } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useMilestones } from '../../context/MilestoneContext';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../ui/ProgressBar';

interface MilestoneTimelineProps {
  milestones: Milestone[];
  onEdit: (milestone: Milestone) => void;
}

export const MilestoneTimeline: React.FC<MilestoneTimelineProps> = ({ milestones, onEdit }) => {
  const { tasks } = useTasks();
  const { deleteMilestone } = useMilestones();
  const { t } = useTranslation();

  // Sort milestones chronologically
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime()
  );

  if (sortedMilestones.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        <Flag size={48} className="mx-auto text-slate-300 mb-4" />
        <p>{t('milestones.noMilestones')}</p>
      </div>
    );
  }

  return (
    <div className="relative py-8">
      {/* The vertical line */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-slate-200 dark:bg-slate-700 rounded-full" />
      
      <div className="space-y-12">
        {sortedMilestones.map((milestone, index) => {
          // Calculate progress
          const milestoneTasks = tasks.filter(t => t.milestoneId === milestone.id);
          const totalTasks = milestoneTasks.length;
          const completedTasks = milestoneTasks.filter(t => t.completed || t.status === 'done').length;
          const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
          
          const isPastDue = new Date(milestone.targetDate).getTime() < new Date().getTime() && milestone.status !== 'completed';

          return (
            <motion.div 
              key={milestone.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-24 pr-4 group"
            >
              {/* Timeline dot */}
              <div className={clsx(
                "absolute left-[26px] top-4 w-4 h-4 rounded-full border-4 border-white dark:border-slate-900 z-10 shadow-sm",
                milestone.status === 'completed' ? "bg-teal-500" :
                milestone.status === 'at_risk' || isPastDue ? "bg-pink-500" :
                milestone.status === 'on_track' ? "bg-primary" : "bg-slate-300 dark:bg-slate-600"
              )} />
              
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow relative">
                {/* Actions */}
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => onEdit(milestone)} className="text-slate-400 hover:text-primary p-1">
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => {
                      if(confirm(t('milestones.deleteConfirm'))) deleteMilestone(milestone.id);
                    }} 
                    className="text-slate-400 hover:text-pink-600 p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="flex items-center gap-3 mb-2 pr-16">
                  <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">
                    {milestone.name}
                  </h3>
                  <span className={clsx(
                    "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
                    milestone.status === 'completed' ? "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-400" :
                    milestone.status === 'at_risk' ? "bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-900/30 dark:border-pink-800 dark:text-pink-400" :
                    milestone.status === 'on_track' ? "bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9] dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-300" :
                    "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                  )}>
                    {t(`milestones.status.${milestone.status}`)}
                  </span>
                </div>
                
                {milestone.description && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    {milestone.description}
                  </p>
                )}

                <div className="flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-300 mb-4">
                  <Calendar size={16} className={isPastDue ? "text-pink-500" : "text-primary"} />
                  <span className={isPastDue ? "text-pink-600 dark:text-pink-400" : ""}>
                    {t('milestones.target')}: {new Date(milestone.targetDate).toLocaleDateString()}
                    {isPastDue && ` (${t('milestones.overdue')})`}
                  </span>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mb-1.5">
                    <span>{t('common.progress').toUpperCase()} ({completedTasks}/{totalTasks})</span>
                    <span>{progress}%</span>
                  </div>
                  <ProgressBar progress={progress} color={progress === 100 ? "bg-teal-500" : "bg-primary"} />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
