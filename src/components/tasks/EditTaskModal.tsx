import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Folder, MessageSquare, AlignLeft, CheckSquare, Plus, Trash2, Download, Upload, Clock, Play, Square, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '../ui/Button';
import { useTasks } from '../../hooks/useTasks';
import { useAuth } from '../../context/AuthContext';
import { useActivity } from '../../context/ActivityContext';
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
  const { updateTask, categories, checklistTemplates, saveChecklistTemplate, addSubTask, toggleSubTask, deleteSubTask, startTimer, stopTimer } = useTasks();
  const { user } = useAuth();
  const { projects } = useProjects();
  const { milestones } = useMilestones();
  const { t } = useTranslation();
  const { getTaskActivities } = useActivity();

  const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'checklist' | 'activity'>('details');
  const [newSubTask, setNewSubTask] = useState('');
  const [templateName, setTemplateName] = useState('');
  const [showTemplateSave, setShowTemplateSave] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || '');
  const [priority, setPriority] = useState(task.priority);
  const [category, setCategory] = useState(task.category);
  const [projectId, setProjectId] = useState(task.projectId || '');
  const [milestoneId, setMilestoneId] = useState(task.milestoneId || '');
  const [dueDate, setDueDate] = useState(task.dueDate || '');
  const [reminderAt, setReminderAt] = useState(task.reminderAt || '');
  const [status, setStatus] = useState(task.status || 'todo');
  
  const [isRecurring, setIsRecurring] = useState(task.isRecurring || false);
  const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    (task.recurringConfig?.frequency as 'daily' | 'weekly' | 'monthly') || 'daily'
  );
  const [recurringInterval, setRecurringInterval] = useState(task.recurringConfig?.interval || 1);

  useEffect(() => {
    if (isOpen) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setCategory(task.category);
      setProjectId(task.projectId || '');
      setMilestoneId(task.milestoneId || '');
      setDueDate(task.dueDate || '');
      setReminderAt(task.reminderAt || '');
      setStatus(task.status || 'todo');
      setIsRecurring(task.isRecurring || false);
      setRecurringFrequency((task.recurringConfig?.frequency as 'daily' | 'weekly' | 'monthly') || 'daily');
      setRecurringInterval(task.recurringConfig?.interval || 1);
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
      reminderAt: reminderAt || undefined,
      status,
      isRecurring,
      recurringConfig: isRecurring ? {
        frequency: recurringFrequency,
        interval: recurringInterval,
      } : undefined,
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

  const activeTimeEntry = (task.timeEntries || []).find(e => e.userId === user?.id && !e.endAt);
  const totalTimeSpent = (task.timeEntries || []).reduce((acc, entry) => {
    if (entry.duration) return acc + entry.duration;
    if (!entry.endAt && entry.startAt) {
      return acc + Math.floor((Date.now() - new Date(entry.startAt).getTime()) / 1000);
    }
    return acc;
  }, 0);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
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
              {t('taskModal.tabDetails')}
            </button>
            <button 
              onClick={() => setActiveTab('comments')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'comments' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <MessageSquare size={16} />
              {t('taskModal.tabComments')} ({(task.comments || []).length})
            </button>
            <button 
              onClick={() => setActiveTab('checklist')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'checklist' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <CheckSquare size={16} />
              {t('taskModal.tabChecklist')} ({(task.subTasks || []).length})
            </button>
            <button 
              onClick={() => setActiveTab('activity')}
              className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'activity' ? 'border-purple-500 text-purple-600 dark:text-purple-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
            >
              <Activity size={16} />
              {t('taskModal.tabActivity')}
            </button>
          </div>

          {activeTab === 'details' && (
            <div className="bg-slate-50 dark:bg-slate-800/50 p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <Clock size={20} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{t('taskModal.timeTracked')}</p>
                  <p className="text-lg font-bold font-mono text-slate-800 dark:text-slate-100">
                    {formatTime(totalTimeSpent)}
                  </p>
                </div>
              </div>
              <div>
                {activeTimeEntry ? (
                  <Button 
                    type="button" 
                    variant="danger" 
                    icon={<Square size={16} />} 
                    onClick={() => user && stopTimer(task.id, user.id)}
                    className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                  >
                    {t('taskModal.stopTimer')}
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="primary" 
                    icon={<Play size={16} />} 
                    onClick={() => user && startTimer(task.id, user.id)}
                  >
                    {t('taskModal.startTimer')}
                  </Button>
                )}
              </div>
            </div>
          )}

          <div className="p-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
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
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  {t('taskModal.reminder')}
                </label>
                <input
                  type="datetime-local"
                  value={reminderAt}
                  onChange={(e) => setReminderAt(e.target.value)}
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                />
              </div>
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

            <div className="flex items-center gap-4 w-full mt-2">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isRecurring}
                    onChange={(e) => setIsRecurring(e.target.checked)}
                    className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                  />
                  <span>🔁 Recurring Task</span>
                </label>

                {isRecurring && (
                  <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2">
                    <span className="text-sm text-slate-500">Repeat every</span>
                    <input
                      type="number"
                      min="1"
                      value={recurringInterval}
                      onChange={(e) => setRecurringInterval(Number(e.target.value) || 1)}
                      className="w-16 text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-center"
                    />
                    <select
                      value={recurringFrequency}
                      onChange={(e) => setRecurringFrequency(e.target.value as any)}
                      className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800"
                    >
                      <option value="daily">Day(s)</option>
                      <option value="weekly">Week(s)</option>
                      <option value="monthly">Month(s)</option>
                    </select>
                  </div>
                )}
              </div>
            </form>
            ) : activeTab === 'comments' && projectId ? (
              <div className="flex flex-col h-full min-h-[300px]">
                <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                  <CommentList comments={task.comments || []} onDelete={handleDeleteComment} />
                </div>
                <CommentForm onSubmit={handleAddComment} />
              </div>
            ) : activeTab === 'checklist' ? (
              <div className="space-y-4 min-h-[300px]">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Checklist</h3>
                  <div className="flex items-center gap-2">
                    {checklistTemplates.length > 0 && (
                      <div className="relative group">
                        <Button type="button" variant="secondary" icon={<Download size={14} />} className="text-xs py-1 px-2 h-auto">
                          {t('taskModal.loadTemplate')}
                        </Button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10 p-1">
                          {checklistTemplates.map(t => (
                            <button
                              key={t.id}
                              type="button"
                              onClick={() => {
                                updateTask(task.id, {
                                  subTasks: [
                                    ...task.subTasks,
                                    ...t.items.map(item => ({ ...item, id: uuidv4(), completed: false }))
                                  ]
                                });
                              }}
                              className="w-full text-left px-3 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-md truncate"
                            >
                              {t.name}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {task.subTasks.length > 0 && (
                      <Button 
                        type="button" 
                        variant="secondary" 
                        icon={<Upload size={14} />} 
                        className="text-xs py-1 px-2 h-auto"
                        onClick={() => setShowTemplateSave(!showTemplateSave)}
                      >
                        {t('taskModal.saveTemplate')}
                      </Button>
                    )}
                  </div>
                </div>

                {showTemplateSave && (
                  <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-200 dark:border-slate-700">
                    <input
                      type="text"
                      value={templateName}
                      onChange={e => setTemplateName(e.target.value)}
                      placeholder={t('taskModal.templateName')}
                      className="flex-1 text-sm bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
                    />
                    <Button
                      type="button"
                      disabled={!templateName.trim()}
                      onClick={() => {
                        saveChecklistTemplate(templateName.trim(), task.subTasks.map(st => ({ id: uuidv4(), title: st.title, order: 0 })));
                        setTemplateName('');
                        setShowTemplateSave(false);
                      }}
                      className="py-1 px-3 h-auto text-xs"
                    >
                      Save
                    </Button>
                  </div>
                )}

                <div className="space-y-2">
                  {task.subTasks.map(st => (
                    <div key={st.id} className="flex items-center justify-between group bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={st.completed}
                          onChange={() => toggleSubTask(task.id, st.id)}
                          className="rounded-full w-4 h-4 text-purple-600 focus:ring-purple-500 border-slate-300 cursor-pointer"
                        />
                        <span className={`text-sm ${st.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
                          {st.title}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => deleteSubTask(task.id, st.id)}
                        className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!newSubTask.trim() || task.subTasks.length >= 20) return;
                    addSubTask(task.id, newSubTask.trim());
                    setNewSubTask('');
                  }}
                  className="flex items-center gap-2 mt-4"
                >
                  <input
                    type="text"
                    value={newSubTask}
                    onChange={e => setNewSubTask(e.target.value)}
                    placeholder="Add checklist item..."
                    className="flex-1 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 text-slate-800 dark:text-slate-200"
                  />
                  <Button type="submit" disabled={!newSubTask.trim()} icon={<Plus size={16} />} className="px-3">
                    Add
                  </Button>
                </form>
              </div>
            ) : activeTab === 'activity' ? (
              <div className="space-y-4 min-h-[300px]">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 mb-4">{t('taskModal.taskActivity')}</h3>
                {getTaskActivities(task.id).length === 0 ? (
                  <p className="text-sm text-slate-500 text-center py-8">{t('taskModal.noActivity')}</p>
                ) : (
                  <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 dark:before:via-slate-700 before:to-transparent">
                    {getTaskActivities(task.id).map(log => (
                      <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                          <Activity size={16} />
                        </div>
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-slate-800 dark:text-slate-100 text-sm">{log.action}</span>
                            <span className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <p className="text-xs text-slate-500">{new Date(log.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
