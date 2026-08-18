import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Users, Calendar, Folder, X, CheckCircle2, Circle } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Project } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { useTasks } from '../../hooks/useTasks';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../ui/ProgressBar';

interface ProjectCardProps {
 project: Project;
 onEdit: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
 const { deleteProject } = useProjects();
 const { tasks } = useTasks();
 const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showTasksModal, setShowTasksModal] = useState(false);

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.completed || t.status === 'done');
  const percentage = projectTasks.length === 0 ? 0 : Math.round((completedTasks.length / projectTasks.length) * 100);

 return (
 <>
 <motion.div
 layout
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9 }}
 whileHover={{ y: -4 }}
 transition={{ type: "spring", stiffness: 400, damping: 30 }}
 className="bg-white dark:bg-[#1A1A1A] rounded-lg border border-border-color dark:border-border-color shadow-sm hover:shadow-md p-5 flex flex-col transition-all duration-300 relative group"
 >
 <div className="flex items-start justify-between mb-4">
 <div className="flex items-center gap-3">
 <div 
 className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
 style={{ backgroundColor: project.color }}
 >
 <Folder size={24} />
 </div>
 <div>
 <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 leading-tight">
 {project.name}
 </h3>
 <div className="flex items-center gap-2 mt-1">
 <span className={clsx(
 "text-xs px-2 py-0.5 rounded-full font-bold uppercase",
 project.status === 'active' ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" :
 project.status === 'on_hold' ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" :
 project.status === 'completed' ? "bg-subtle text-primary dark:bg-blue-900/30 dark:text-primary" :
 "bg-slate-100 text-slate-700 dark:bg-[#242424] dark:text-slate-400"
 )}>
 {t(`projects.status.${project.status}`)}
 </span>
 </div>
 </div>
 </div>
 
 <div className="relative">
 <button 
 onClick={() => setShowMenu(!showMenu)}
 className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
 >
 <MoreVertical size={18} />
 </button>
 
 {showMenu && (
 <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-slate-100 dark:border-border-color py-1 z-10 animate-in fade-in slide-in-">
 <button
 onClick={() => { setShowMenu(false); onEdit(project); }}
 className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
 >
 <Edit2 size={14} /> {t('projects.editProject')}
 </button>
 <button
 onClick={() => { 
 setShowMenu(false); 
 if (confirm(t('projects.deleteConfirm', { name: project.name }))) {
 deleteProject(project.id);
 }
 }}
 className="w-full text-left px-3 py-2 text-sm text-pink-600 hover:bg-pink-50 dark:hover:bg-pink-900/20 flex items-center gap-2"
 >
 <Trash2 size={14} /> {t('projects.deleteProject')}
 </button>
 </div>
 )}
 </div>
 </div>

 {project.description && (
 <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-4 flex-1">
 {project.description}
 </p>
 )}

 <div className="mt-auto">
 <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
 <span className="flex items-center gap-1.5 font-medium">
 <Users size={14} /> {project.memberIds.length} {t('projects.members')}
 </span>
 {project.dueDate && (
 <span className="flex items-center gap-1.5 font-medium">
 <Calendar size={14} /> {new Date(project.dueDate).toLocaleDateString()}
 </span>
 )}
 </div>
 
 <div 
 className="pt-3 border-t border-slate-100 dark:border-border-color cursor-pointer group/progress"
 onClick={() => setShowTasksModal(true)}
 >
 <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
 <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/progress:text-primary transition-colors">
 {t('common.progress')}
 </span>
 <span className="font-bold">{percentage}%</span>
 </div>
 <ProgressBar progress={percentage} color="bg-teal-500" />
 <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-1 italic">
 {completedTasks.length} / {projectTasks.length} Tasks Completed
 </p>
 </div>
 </div>
 </motion.div>
      {showTasksModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#242424] rounded-lg w-full max-w-md shadow-sm overflow-hidden border border-slate-100 dark:border-border-color animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-border-color/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Project Tasks</h2>
              <button 
                onClick={() => setShowTasksModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X size={12} />
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {projectTasks.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No tasks in this project yet.</p>
              ) : (
                <div className="space-y-2">
                  {projectTasks.map(task => {
                    const isDone = task.completed || task.status === 'done';
                    return (
                      <div key={task.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-border-color bg-slate-50/50 dark:bg-[#1A1A1A]/50">
                        <div className={clsx("shrink-0", isDone ? "text-teal-500" : "text-slate-300 dark:text-slate-600")}>
                          {isDone ? <CheckCircle2 size={18} /> : <Circle size={18} />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={clsx("text-sm font-medium truncate", isDone ? "text-slate-500 line-through" : "text-slate-700 dark:text-slate-300")}>
                            {task.title}
                          </p>
                          <p className="text-xs text-slate-500 capitalize">{task.status.replace('_', ' ')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
 );
};
