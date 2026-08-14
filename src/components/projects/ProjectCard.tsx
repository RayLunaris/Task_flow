import React, { useState } from 'react';
import { MoreVertical, Edit2, Trash2, Users, Calendar, Folder } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Project } from '../../types';
import { useProjects } from '../../context/ProjectContext';
import { useTranslation } from 'react-i18next';
import { ProgressBar } from '../ui/ProgressBar';

interface ProjectCardProps {
  project: Project;
  onEdit: (project: Project) => void;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, onEdit }) => {
  const { commitProjectProgress, deleteProject } = useProjects();
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newProgress, setNewProgress] = useState(project.progress || 0);
  const [progressMsg, setProgressMsg] = useState('');
  const [showHistory, setShowHistory] = useState(false);

  const percentage = project.progress || 0;

  const handleCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (progressMsg.trim()) {
      commitProjectProgress(project.id, newProgress, progressMsg);
      setShowUpdateModal(false);
      setProgressMsg('');
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md p-5 flex flex-col transition-all duration-300 relative group"
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg"
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
                  project.status === 'completed' ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                  "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400"
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
              <div className="absolute right-0 top-full mt-1 w-44 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 py-1 z-10 animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => { setShowMenu(false); setShowUpdateModal(true); setNewProgress(percentage); setProgressMsg(''); }}
                  className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                >
                  <Edit2 size={14} /> {t('projects.updateProgress')}
                </button>
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
            className="pt-3 border-t border-slate-100 dark:border-slate-800 cursor-pointer group/progress"
            onClick={() => setShowHistory(true)}
          >
            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
              <span className="font-bold text-slate-700 dark:text-slate-300 group-hover/progress:text-primary transition-colors">
                {t('common.progress')}
              </span>
              <span className="font-bold">{percentage}%</span>
            </div>
            <ProgressBar progress={percentage} color="bg-teal-500" />
            {(project.updates && project.updates.length > 0) && (
              <p className="text-[10px] text-slate-400 mt-1.5 line-clamp-1 italic">
                "{project.updates[0].description}"
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Update Progress Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                {t('projects.progressModalTitle', { name: project.name })}
              </h2>
              <button 
                onClick={() => setShowUpdateModal(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleCommit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {t('projects.progress') || 'Progress'}: {newProgress}%
                </label>
                <input 
                  type="range" min="0" max="100" 
                  value={newProgress} 
                  onChange={(e) => setNewProgress(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {t('projects.description') || 'Message'}
                </label>
                <textarea 
                  value={progressMsg}
                  onChange={(e) => setProgressMsg(e.target.value)}
                  placeholder={t('projects.progressPlaceholder')}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-slate-800 dark:text-slate-200 resize-none h-24"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowUpdateModal(false)} className="px-4 py-2 text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
                  {t('common.cancel')}
                </button>
                <button type="submit" disabled={!progressMsg.trim()} className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary/90 rounded-xl disabled:opacity-50">
                  {t('projects.commitProgress')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-700/50">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Progress History</h2>
              <button 
                onClick={() => setShowHistory(false)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 max-h-96 overflow-y-auto">
              {(!project.updates || project.updates.length === 0) ? (
                <p className="text-sm text-slate-500 text-center py-4">No progress commits yet.</p>
              ) : (
                <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                  {project.updates.map(upd => (
                    <div key={upd.id} className="relative flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#E3F2FD] dark:bg-blue-900/50 border-4 border-white dark:border-slate-800 flex items-center justify-center shrink-0 z-10 text-xs font-bold text-[#0D47A1] dark:text-blue-300">
                        {upd.percentage}%
                      </div>
                      <div className="pt-2">
                        <p className="text-xs text-slate-500 mb-1">{new Date(upd.createdAt).toLocaleString()}</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{upd.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
