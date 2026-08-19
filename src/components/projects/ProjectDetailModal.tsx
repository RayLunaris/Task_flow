import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { 
  X, Edit2, Calendar, Users, AlignLeft, 
  CheckSquare, Flag, Circle, CheckCircle2,
  Folder, Clock, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

import type { Project } from '../../types';
import { useTasks } from '../../hooks/useTasks';
import { useMilestones } from '../../context/MilestoneContext';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { ProgressBar } from '../ui/ProgressBar';

interface ProjectDetailModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export const ProjectDetailModal: React.FC<ProjectDetailModalProps> = ({ 
  project, isOpen, onClose, onEdit 
}) => {
  const { t } = useTranslation();
  const { tasks } = useTasks();
  const { milestones } = useMilestones();
  const { user, users } = useAuth();
  const { updateProject } = useProjects();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'tasks' | 'milestones'>('overview');
  const [showAddMember, setShowAddMember] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setActiveTab('overview');
      setShowAddMember(false);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, project]);

  if (!isOpen) return null;

  const projectTasks = tasks.filter(t => t.projectId === project.id);
  const completedTasks = projectTasks.filter(t => t.completed || t.status === 'done');
  const percentage = projectTasks.length === 0 ? 0 : Math.round((completedTasks.length / projectTasks.length) * 100);

  const projectMilestones = milestones.filter(m => m.projectId === project.id);
  const manager = users.find(u => u.id === project.managerId);
  const members = users.filter(u => project.memberIds.includes(u.id));
  const availableUsers = users.filter(u => u.status !== 'inactive' && !project.memberIds.includes(u.id));
  
  const isAdmin = user?.role === 'admin';

  const handleAddMember = (userId: string) => {
    updateProject(project.id, { memberIds: [...project.memberIds, userId] });
    setShowAddMember(false);
  };

  const handleRemoveMember = (userId: string) => {
    if (confirm("Are you sure you want to remove this member?")) {
      updateProject(project.id, { memberIds: project.memberIds.filter(id => id !== userId) });
    }
  };

  const modalContent = (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm overflow-hidden border border-border-color dark:border-border-color flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-slate-100 dark:border-border-color shrink-0 bg-slate-50/50 dark:bg-[#1A1A1A]">
            <div className="flex items-center gap-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-sm"
                style={{ backgroundColor: project.color }}
              >
                <Folder size={24} />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 leading-tight">
                    {project.name}
                  </h2>
                  <span className={clsx(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
                    project.status === 'active' ? "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-400" :
                    project.status === 'on_hold' ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400" :
                    project.status === 'completed' ? "bg-[#E3F2FD] text-[#0D47A1] border-[#90CAF9] dark:bg-blue-900/30 dark:border-blue-800 dark:text-primary" :
                    "bg-slate-50 text-slate-700 border-border-color dark:bg-[#242424] dark:border-border-color dark:text-slate-400"
                  )}>
                    {t(`projects.status.${project.status}`)}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-1.5 text-xs font-medium text-slate-500 dark:text-slate-400">
                  <span className="flex items-center gap-1.5">
                    <Users size={14} /> {project.memberIds.length} {t('projects.members')}
                  </span>
                  {project.dueDate && (
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} /> {t('milestones.target')}: {new Date(project.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="p-2 rounded-lg text-slate-500 hover:text-primary hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-sm font-medium border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
              >
                <Edit2 size={16} /> <span className="hidden sm:inline">{t('projects.editProject', 'Edit')}</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex px-2 border-b border-slate-100 dark:border-border-color bg-white dark:bg-[#1A1A1A] shrink-0 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={clsx(
                "px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2",
                activeTab === 'overview' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <AlignLeft size={16} /> Overview
            </button>
            <button
              onClick={() => setActiveTab('tasks')}
              className={clsx(
                "px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2",
                activeTab === 'tasks' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <CheckSquare size={16} /> Tasks ({projectTasks.length})
            </button>
            <button
              onClick={() => setActiveTab('milestones')}
              className={clsx(
                "px-4 py-3 text-sm font-bold border-b-2 whitespace-nowrap transition-colors flex items-center gap-2",
                activeTab === 'milestones' 
                  ? "border-primary text-primary" 
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
              )}
            >
              <Flag size={16} /> Milestones ({projectMilestones.length})
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-5 overflow-y-auto flex-1 bg-slate-50/30 dark:bg-transparent">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Progress */}
                <div className="bg-white dark:bg-[#242424] p-4 rounded-xl border border-slate-100 dark:border-border-color shadow-sm">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300">Project Progress</span>
                    <span className="font-bold text-primary">{percentage}%</span>
                  </div>
                  <ProgressBar progress={percentage} color={percentage === 100 ? "bg-teal-500" : "bg-primary"} />
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                    {completedTasks.length} of {projectTasks.length} tasks completed
                  </p>
                </div>

                {/* Description */}
                {project.description ? (
                  <div>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mb-2 flex items-center gap-2">
                      <AlignLeft size={16} className="text-slate-400" /> Description
                    </h3>
                    <div className="bg-white dark:bg-[#242424] p-4 rounded-xl border border-slate-100 dark:border-border-color text-sm text-slate-600 dark:text-slate-300 shadow-sm whitespace-pre-wrap">
                      {project.description}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-slate-400 italic">No description provided.</div>
                )}

                {/* Team / Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white dark:bg-[#242424] p-4 rounded-xl border border-slate-100 dark:border-border-color shadow-sm">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Project Manager</h4>
                    {manager ? (
                      <div className="flex items-center gap-3">
                        <img src={manager.avatar} alt={manager.name} className="w-8 h-8 rounded-full bg-slate-100 object-cover" />
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-tight">{manager.name}</p>
                          <p className="text-xs text-slate-500">{manager.role}</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Unassigned</p>
                    )}
                  </div>
                  
                  <div className="bg-white dark:bg-[#242424] p-4 rounded-xl border border-slate-100 dark:border-border-color shadow-sm relative">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Team Members</h4>
                      {isAdmin && availableUsers.length > 0 && (
                        <div className="relative">
                          <button
                            onClick={() => setShowAddMember(!showAddMember)}
                            className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md"
                          >
                            <Plus size={14} /> Add
                          </button>
                          
                          {showAddMember && (
                            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-slate-100 dark:border-border-color py-1 z-10 max-h-48 overflow-y-auto">
                              {availableUsers.map(u => (
                                <button
                                  key={u.id}
                                  onClick={() => handleAddMember(u.id)}
                                  className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2"
                                >
                                  <img src={u.avatar} alt={u.name} className="w-5 h-5 rounded-full" />
                                  <span className="truncate">{u.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    {members.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {members.map(member => (
                          <div key={member.id} className="flex items-center gap-2 bg-slate-50 dark:bg-[#1A1A1A] pl-2.5 pr-1.5 py-1.5 rounded-lg border border-slate-100 dark:border-border-color group">
                            <img src={member.avatar} alt={member.name} className="w-5 h-5 rounded-full object-cover" />
                            <span className="text-xs font-medium text-slate-700 dark:text-slate-300 pr-1">{member.name}</span>
                            {isAdmin && (
                              <button 
                                onClick={() => handleRemoveMember(member.id)}
                                className="text-slate-400 hover:text-pink-500 hover:bg-pink-50 dark:hover:bg-pink-900/30 p-0.5 rounded transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove member"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">No members added.</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tasks' && (
              <div className="space-y-3">
                {projectTasks.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-[#242424] rounded-xl border border-dashed border-slate-200 dark:border-border-color">
                    <CheckSquare size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-slate-500">No tasks in this project yet.</p>
                  </div>
                ) : (
                  projectTasks
                    .sort((a, b) => {
                      if (a.completed !== b.completed) return a.completed ? 1 : -1;
                      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                    })
                    .map(task => {
                      const isDone = task.completed || task.status === 'done';
                      return (
                        <div key={task.id} className="flex items-center gap-3 p-3.5 rounded-xl border border-slate-100 dark:border-border-color bg-white dark:bg-[#242424] shadow-sm hover:shadow transition-shadow">
                          <div className={clsx("shrink-0", isDone ? "text-teal-500" : "text-slate-300 dark:text-slate-600")}>
                            {isDone ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={clsx("text-sm font-bold truncate mb-0.5", isDone ? "text-slate-400 line-through" : "text-slate-700 dark:text-slate-200")}>
                              {task.title}
                            </p>
                            <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                              <span className="capitalize px-1.5 py-0.5 rounded-md bg-slate-100 dark:bg-[#1A1A1A]">{task.status.replace('_', ' ')}</span>
                              {task.dueDate && (
                                <span className="flex items-center gap-1">
                                  <Clock size={12} /> {new Date(task.dueDate).toLocaleDateString()}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                  })
                )}
              </div>
            )}

            {activeTab === 'milestones' && (
              <div className="space-y-3">
                {projectMilestones.length === 0 ? (
                  <div className="text-center py-12 bg-white dark:bg-[#242424] rounded-xl border border-dashed border-slate-200 dark:border-border-color">
                    <Flag size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-slate-500">No milestones defined for this project.</p>
                  </div>
                ) : (
                  projectMilestones.map(ms => {
                    return (
                      <div key={ms.id} className="p-4 rounded-xl border border-slate-100 dark:border-border-color bg-white dark:bg-[#242424] shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">{ms.name}</h4>
                          <span className={clsx(
                            "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border",
                            ms.status === 'completed' ? "bg-teal-50 text-teal-700 border-teal-200" :
                            ms.status === 'at_risk' ? "bg-pink-50 text-pink-700 border-pink-200" :
                            ms.status === 'on_track' ? "bg-blue-50 text-blue-700 border-blue-200" :
                            "bg-slate-50 text-slate-700 border-slate-200"
                          )}>
                            {t(`milestones.status.${ms.status}`)}
                          </span>
                        </div>
                        {ms.description && (
                          <p className="text-sm text-slate-500 mb-3 line-clamp-2">{ms.description}</p>
                        )}
                        <div className="flex items-center gap-3 text-xs font-medium text-slate-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} /> {new Date(ms.targetDate).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-slate-500">
                            <span>Progress</span>
                            <span>{ms.progress || 0}%</span>
                          </div>
                          <ProgressBar progress={ms.progress || 0} color={ms.progress === 100 ? "bg-teal-500" : "bg-primary"} />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return null;
};
