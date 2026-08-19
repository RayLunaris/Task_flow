import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Users, Calendar, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Project } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { useTasks } from '../../hooks/useTasks';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../ui/ProgressBar';
import { ProjectDetailModal } from './ProjectDetailModal';

interface ProjectCardProps {
 project: Project;
 onEdit: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
 const { deleteProject } = useProjects();
 const { tasks } = useTasks();
 const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);

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
 className="bg-white dark:bg-[#1A1A1A] rounded-lg border border-border-color dark:border-border-color shadow-sm hover:shadow-md p-5 flex flex-col transition-all duration-300 relative group cursor-pointer"
 onClick={() => setShowDetailModal(true)}
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
 onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
 className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
 >
 <MoreVertical size={18} />
 </button>
 
 {showMenu && (
 <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-slate-100 dark:border-border-color py-1 z-10 animate-in fade-in slide-in-">
 <button
 onClick={(e) => { e.stopPropagation(); setShowMenu(false); onEdit(project); }}
 className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
 >
 <Edit2 size={14} /> {t('projects.editProject')}
 </button>
 <button
 onClick={(e) => { 
 e.stopPropagation();
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
 className="pt-3 border-t border-slate-100 dark:border-border-color group/progress"
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
 <ProjectDetailModal 
 project={project}
 isOpen={showDetailModal}
 onClose={() => setShowDetailModal(false)}
 onEdit={() => { setShowDetailModal(false); onEdit(project); }}
 />
    </>
 );
};
