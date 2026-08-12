import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Folder, MessageSquare, AlignLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/Button';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { useProjects } from '../../context/ProjectContext';
import { useMilestones } from '../../context/MilestoneContext';
import type { Task, Comment } from '../../types';
import { CommentList } from '../comments/CommentList';
import { CommentForm } from '../comments/CommentForm';

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
}

export const EditTaskModal: React.FC<EditTaskModalProps> = ({ task, isOpen, onClose }) => {
  const { updateTask, categories } = useTasks();
  const { user } = useAuth();
  const { projects } = useProjects();
  const { milestones } = useMilestones();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<'details' | 'comments'>('details');

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [projectId, setProjectId] = useState(task.projectId || '');
  const [milestoneId, setMilestoneId] = useState(task.milestoneId || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [status, setStatus] = useState(task.status || 'todo');

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategory(task.category);
      setProjectId(task.projectId || '');
      setMilestoneId(task.milestoneId || '');
      setDueDate(task.dueDate || '');
      setStatus(task.status || 'todo');
      setActiveTab('details');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
      priority,
      category,
      projectId: projectId || undefined,
      milestoneId: milestoneId || undefined,
      dueDate: dueDate || undefined,
      status,
    });

    onClose();
  };

  const handleAddComment = (content: string, mentions: string[]) => {
    if (!user) return;
    const newComment: Comment = {
      id: uuidv4(),
      taskId: task.id,
      userId: user.id,
      content,
      mentions,
      createdAt: new Date().toISOString(),
      isEdited: false
    };
    updateTask(task.id, {
      comments: [...(task.comments || []), newComment]
    });
  };

  const handleDeleteComment = (commentId: string) => {
    updateTask(task.id, {
      comments: (task.comments || []).filter(c => c.id !== commentId)
    });
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
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate pr-4">
              {task.title}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex border-b border-slate-100 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('details')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'details' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <AlignLeft size={16} />
              Details
            </button>
            {projectId && (
              <button 
                onClick={() => setActiveTab('comments')}
                className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'comments' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                <MessageSquare size={16} />
                Comments ({(task.comments || []).length})
              </button>
            )}
          </div>

          <div className="p-4 max-h-[60vh] overflow-y-auto custom-scrollbar">
            {activeTab === 'details' ? (
              <form id="edit-task-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('taskForm.placeholder')}
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 text-slate-800 dark:text-slate-100 font-medium"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('taskForm.description')}
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 resize-none min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Priority
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                >
                  <option value="urgent">🔴 Urgent</option>
                  <option value="high">🟠 {t('priority.high')}</option>
                  <option value="medium">🟡 {t('priority.medium')}</option>
                  <option value="low">🔵 {t('priority.low')}</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {projects.length > 0 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Project
                  </label>
                  <div className="relative">
                    <Folder size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select
                      value={projectId}
                      onChange={(e) => {
                        const newProjectId = e.target.value;
                        setProjectId(newProjectId);
                        setMilestoneId('');
                        if (!newProjectId) {
                          setActiveTab('details');
                        }
                      }}
                      className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm text-slate-800 dark:text-slate-200 appearance-none font-medium"
                    >
                      <option value="">No Project</option>
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {projectId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Milestone
                    </label>
                    <div className="relative">
                      <select
                        value={milestoneId}
                        onChange={(e) => setMilestoneId(e.target.value)}
                        className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-purple-200 text-sm text-slate-800 dark:text-slate-200 appearance-none font-medium"
                      >
                        <option value="">No Milestone</option>
                        {milestones.filter(m => m.projectId === projectId).map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">Review</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>
            </form>
            ) : projectId ? (
              <div className="flex flex-col h-full min-h-[300px]">
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <CommentList comments={task.comments || []} onDelete={handleDeleteComment} />
                </div>
                <CommentForm onSubmit={handleAddComment} />
              </div>
            ) : null}
          </div>

          <div className="p-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="secondary" onClick={onClose}>
              {t('common.cancel')}
            </Button>
            {activeTab === 'details' && (
              <Button type="submit" form="edit-task-form" disabled={!title.trim()} icon={<Save size={18} />}>
                {t('common.save')}
              </Button>
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
