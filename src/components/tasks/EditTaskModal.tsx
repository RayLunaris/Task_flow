import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { 
 X, 
 Save, 
 MessageSquare, 
 AlignLeft, 
 CheckSquare, 
 Plus, 
 Trash2, 
 Clock, 
 Play, 
 Square, 
 Activity, 
 CheckCircle2, 
 AlertCircle, 
 Send, 
 RotateCcw
} from 'lucide-react';
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
 const { 
 updateTask, 
 categories, 
 addSubTask, 
 toggleSubTask, 
 deleteSubTask, 
 startTimer, 
 stopTimer,
 submitForReview,
 approveTask,
 rejectTask,
 tasks
 } = useTasks();
 
 const { user, users } = useAuth();
 const { projects } = useProjects();
 const { milestones } = useMilestones();
 const { t } = useTranslation();
 const { getTaskActivities } = useActivity();

 const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'checklist' | 'activity'>('details');
 const [newSubTask, setNewSubTask] = useState('');

 const [title, setTitle] = useState(task.title);
 const [description, setDescription] = useState(task.description || '');
 const [priority, setPriority] = useState(task.priority);
 const [category, setCategory] = useState(task.category);
 const [projectId, setProjectId] = useState(task.projectId || '');
 const [milestoneId, setMilestoneId] = useState(task.milestoneId || '');
 const [assigneeId, setAssigneeId] = useState(task.assigneeIds?.[0] || '');
 const [reviewerId, setReviewerId] = useState(task.reviewerId || '');
 const [dueDate, setDueDate] = useState(task.dueDate || '');
 const [reminderAt, setReminderAt] = useState(task.reminderAt || '');
 const [status, setStatus] = useState(task.status || 'todo');
 
 const [isRecurring, setIsRecurring] = useState(task.isRecurring || false);
 const [recurringFrequency, setRecurringFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
 (task.recurringConfig?.frequency as 'daily' | 'weekly' | 'monthly') || 'daily'
 );
 const [recurringInterval, setRecurringInterval] = useState(task.recurringConfig?.interval || 1);

 const [showRevisionBox, setShowRevisionBox] = useState(false);
 const [revisionText, setRevisionText] = useState('');

 useEffect(() => {
 if (isOpen) {
 setTitle(task.title);
 setDescription(task.description || '');
 setPriority(task.priority);
 setCategory(task.category);
 setProjectId(task.projectId || '');
 setMilestoneId(task.milestoneId || '');
 setAssigneeId(task.assigneeIds?.[0] || '');
 setReviewerId(task.reviewerId || '');
 setDueDate(task.dueDate || '');
 setReminderAt(task.reminderAt || '');
 setStatus(task.status || 'todo');
 setIsRecurring(task.isRecurring || false);
 setRecurringFrequency((task.recurringConfig?.frequency as 'daily' | 'weekly' | 'monthly') || 'daily');
 setRecurringInterval(task.recurringConfig?.interval || 1);
 setActiveTab('details');
 setShowRevisionBox(false);
 setRevisionText('');
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = 'unset';
 }
 return () => {
 document.body.style.overflow = 'unset';
 };
 }, [isOpen, task]);

 // Compute workload count for all active users
 const userWorkloadMap = useMemo(() => {
 const map: Record<string, number> = {};
 const activeTasks = tasks.filter(t => t.status !== 'done' && !t.completed);
 users.forEach(u => {
 map[u.id] = activeTasks.filter(t => t.assigneeIds?.includes(u.id)).length;
 });
 return map;
 }, [tasks, users]);

 if (!isOpen) return null;

 const isReviewerOrManager = 
 user?.role === 'admin' || 
 user?.role === 'manager' || 
 (task.reviewerId && user?.id === task.reviewerId);

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
 assigneeIds: assigneeId ? [assigneeId] : [],
 reviewerId: reviewerId || undefined,
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

 const handleApprove = () => {
 approveTask(task.id);
 onClose();
 };

 const handleReject = () => {
 if (!revisionText.trim()) return;
 rejectTask(task.id, revisionText.trim());
 onClose();
 };

 const handleSubmitForReview = () => {
 submitForReview(task.id, reviewerId || undefined);
 setStatus('review');
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
 className="relative w-full max-w-xl bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm overflow-hidden border border-border-color dark:border-border-color"
 >
 {/* Modal Header */}
 <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-border-color">
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

 {/* Review & Approval Action Banner */}
 {status === 'review' ? (
 <div className="bg-subtle/90 dark:bg-blue-950/50 p-4 border-b border-blue-200/60 dark:border-blue-800/60 flex flex-col gap-3">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
 <Clock className="text-primary dark:text-primary animate-spin" size={18} />
 <span className="font-bold text-sm">Status: Menunggu Persetujuan (Waiting for Review)</span>
 </div>

 {isReviewerOrManager && !showRevisionBox && (
 <div className="flex items-center gap-2">
 <Button
 type="button"
 size="sm"
 variant="secondary"
 icon={<RotateCcw size={14} />}
 onClick={() => setShowRevisionBox(true)}
 className="border-blue-300 text-primary hover:bg-subtle"
 >
 Minta Revisi
 </Button>
 <Button
 type="button"
 size="sm"
 icon={<CheckCircle2 size={14} />}
 onClick={handleApprove}
 className="bg-emerald-600 hover:bg-emerald-700 text-white"
 >
 Setujui (Approve)
 </Button>
 </div>
 )}
 </div>

 {showRevisionBox && (
 <div className="p-3 bg-white dark:bg-[#1A1A1A] rounded-lg border border-blue-200 dark:border-blue-800 space-y-2 animate-in fade-in">
 <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
 Catatan Masukan / Instruksi Revisi:
 </label>
 <textarea
 value={revisionText}
 onChange={(e) => setRevisionText(e.target.value)}
 placeholder="Jelaskan hal apa yang perlu diperbaiki atau disesuaikan..."
 className="w-full text-xs p-2 rounded-lg border border-border-color dark:border-border-color bg-slate-50 dark:bg-[#242424] text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none h-16"
 />
 <div className="flex justify-end gap-2">
 <Button type="button" size="sm" variant="ghost" onClick={() => setShowRevisionBox(false)}>
 Batal
 </Button>
 <Button
 type="button"
 size="sm"
 variant="danger"
 disabled={!revisionText.trim()}
 onClick={handleReject}
 icon={<Send size={14} />}
 >
 Kirim Revisi
 </Button>
 </div>
 </div>
 )}
 </div>
 ) : task.revisionNote ? (
 <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 border-b border-amber-200/70 dark:border-amber-800/60 text-xs flex items-start gap-2.5 text-amber-800 dark:text-amber-300">
 <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
 <div>
 <strong className="block font-bold">Catatan Revisi Terakhir:</strong>
 <p className="mt-0.5">{task.revisionNote}</p>
 </div>
 </div>
 ) : null}

 {/* Tabs Header */}
 <div className="flex border-b border-slate-100 dark:border-border-color">
 <button 
 onClick={() => setActiveTab('details')}
 className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'details' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
 >
 <AlignLeft size={16} />
 {t('taskModal.tabDetails', 'Detail')}
 </button>
 <button 
 onClick={() => setActiveTab('comments')}
 className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'comments' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
 >
 <MessageSquare size={16} />
 {t('taskModal.tabComments', 'Komentar')} ({(task.comments || []).length})
 </button>
 <button 
 onClick={() => setActiveTab('checklist')}
 className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'checklist' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
 >
 <CheckSquare size={16} />
 {t('taskModal.tabChecklist', 'Checklist')} ({(task.subTasks || []).length})
 </button>
 <button 
 onClick={() => setActiveTab('activity')}
 className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${activeTab === 'activity' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
 >
 <Activity size={16} />
 {t('taskModal.tabActivity', 'Aktivitas')}
 </button>
 </div>

 {/* Time Tracking Row (Details tab) */}
 {activeTab === 'details' && (
 <div className="bg-slate-50 dark:bg-[#242424]/50 p-3.5 border-b border-slate-100 dark:border-border-color flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-9 h-9 rounded-lg bg-subtle dark:bg-blue-900/50 flex items-center justify-center text-primary dark:text-primary">
 <Clock size={18} />
 </div>
 <div>
 <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">{t('taskModal.timeTracked', 'Waktu Tercatat')}</p>
 <p className="text-base font-bold font-mono text-slate-800 dark:text-slate-100">
 {formatTime(totalTimeSpent)}
 </p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 {status !== 'review' && status !== 'done' && (
 <Button
 type="button"
 size="sm"
 variant="secondary"
 icon={<Send size={14} />}
 onClick={handleSubmitForReview}
 className="border-primary/50 text-primary hover:bg-primary/10"
 >
 Kirim untuk Review
 </Button>
 )}

 {activeTimeEntry ? (
 <Button 
 type="button" 
 size="sm"
 variant="danger" 
 icon={<Square size={14} />} 
 onClick={() => user && stopTimer(task.id, user.id)}
 className="animate-pulse shadow-[0_0_15px_rgba(239,68,68,0.3)]"
 >
 {t('taskModal.stopTimer', 'Stop')}
 </Button>
 ) : (
 <Button 
 type="button" 
 size="sm"
 variant="primary" 
 icon={<Play size={14} />} 
 onClick={() => user && startTimer(task.id, user.id)}
 >
 {t('taskModal.startTimer', 'Mulai')}
 </Button>
 )}
 </div>
 </div>
 )}

 {/* Tab Content */}
 <div className="p-5 max-h-[50vh] overflow-y-auto custom-scrollbar">
 {activeTab === 'details' ? (
 <form id="edit-task-form" onSubmit={handleSubmit} className="space-y-4">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Judul Tugas *
 </label>
 <input
 type="text"
 value={title}
 onChange={(e) => setTitle(e.target.value)}
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
 autoFocus
 />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Deskripsi
 </label>
 <textarea
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#242424] p-2.5 rounded-lg border border-border-color dark:border-border-color focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none min-h-[90px]"
 />
 </div>

 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Pelaksana (Assignee)
 </label>
 <select
 value={assigneeId}
 onChange={(e) => setAssigneeId(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200"
 >
 <option value="">Belum Ditugaskan</option>
 {users.filter(u => u.status !== 'inactive' && u.role !== 'client').map((u) => {
 const count = userWorkloadMap[u.id] || 0;
 const dot = count >= 7 ? '🔴' : count >= 4 ? '🟡' : '🟢';
 return (
 <option key={u.id} value={u.id}>
 {dot} {u.name} ({count} task)
 </option>
 );
 })}
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Reviewer (Pemeriksa)
 </label>
 <select
 value={reviewerId}
 onChange={(e) => setReviewerId(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200"
 >
 <option value="">Tanpa Reviewer Khusus</option>
 {users.filter(u => u.status !== 'inactive' && (u.role === 'admin' || u.role === 'manager')).map((u) => (
 <option key={u.id} value={u.id}>
 🔍 {u.name} ({u.role})
 </option>
 ))}
 </select>
 </div>
 </div>

 <div className="grid grid-cols-3 gap-3">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Prioritas
 </label>
 <select
 value={priority}
 onChange={(e) => setPriority(e.target.value as any)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
 >
 <option value="urgent">🔴 Urgent</option>
 <option value="high">🟠 Tinggi</option>
 <option value="medium">🟡 Sedang</option>
 <option value="low">🔵 Rendah</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Status
 </label>
 <select
 value={status}
 onChange={(e) => setStatus(e.target.value as any)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
 >
 <option value="todo">To Do</option>
 <option value="in_progress">In Progress</option>
 <option value="review">Waiting Review</option>
 <option value="done">Done (Selesai)</option>
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Kategori
 </label>
 <select
 value={category}
 onChange={(e) => setCategory(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
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
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Proyek
 </label>
 <select
 value={projectId}
 onChange={(e) => {
 setProjectId(e.target.value);
 setMilestoneId('');
 }}
 className="w-full bg-slate-50 dark:bg-[#242424]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-slate-800 dark:text-slate-200"
 >
 <option value="">No Project</option>
 {projects.map(p => (
 <option key={p.id} value={p.id}>{p.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Milestone
 </label>
 <select
 value={milestoneId}
 onChange={(e) => setMilestoneId(e.target.value)}
 disabled={!projectId}
 className="w-full bg-slate-50 dark:bg-[#242424]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm text-slate-800 dark:text-slate-200 disabled:opacity-50"
 >
 <option value="">No Milestone</option>
 {milestones.filter(m => m.projectId === projectId).map(m => (
 <option key={m.id} value={m.id}>{m.name}</option>
 ))}
 </select>
 </div>
 </div>
 )}
 
 <div className="grid grid-cols-2 gap-3">
 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Tenggat Waktu (Due Date)
 </label>
 <input
 type="date"
 value={dueDate}
 onChange={(e) => setDueDate(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
 />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Pengingat (Reminder)
 </label>
 <input
 type="datetime-local"
 value={reminderAt}
 onChange={(e) => setReminderAt(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
 />
 </div>
 </div>

 <div className="flex items-center gap-4 w-full pt-1">
 <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 cursor-pointer">
 <input
 type="checkbox"
 checked={isRecurring}
 onChange={(e) => setIsRecurring(e.target.checked)}
 className="rounded border-slate-300 text-primary focus:ring-primary w-4 h-4 cursor-pointer"
 />
 <span>🔁 Recurring Task</span>
 </label>

 {isRecurring && (
 <div className="flex items-center gap-2 animate-in fade-in slide-in-">
 <span className="text-sm text-slate-500">Every</span>
 <input
 type="number"
 min="1"
 value={recurringInterval}
 onChange={(e) => setRecurringInterval(Number(e.target.value) || 1)}
 className="w-16 text-sm border border-border-color dark:border-border-color rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
 />
 <select
 value={recurringFrequency}
 onChange={(e) => setRecurringFrequency(e.target.value as any)}
 className="text-sm border border-border-color dark:border-border-color rounded-lg p-1.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424]"
 >
 <option value="daily">Day(s)</option>
 <option value="weekly">Week(s)</option>
 <option value="monthly">Month(s)</option>
 </select>
 </div>
 )}
 </div>
 </form>
 ) : activeTab === 'comments' ? (
 <div className="flex flex-col h-full min-h-[300px]">
 <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
 <CommentList comments={task.comments || []} onDelete={handleDeleteComment} />
 </div>
 <CommentForm onSubmit={handleAddComment} />
 </div>
 ) : activeTab === 'checklist' ? (
 <div className="space-y-4 min-h-[300px]">
 <div className="flex items-center justify-between">
 <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">Checklist / Subtasks</h3>
 </div>

 <div className="space-y-2">
 {task.subTasks.map(st => (
 <div key={st.id} className="flex items-center justify-between group bg-slate-50 dark:bg-[#242424]/50 p-2.5 rounded-lg border border-slate-100 dark:border-border-color/50">
 <div className="flex items-center gap-3">
 <input
 type="checkbox"
 checked={st.completed}
 onChange={() => toggleSubTask(task.id, st.id)}
 className="rounded-full w-4 h-4 text-primary focus:ring-primary border-slate-300 cursor-pointer"
 />
 <span className={`text-sm ${st.completed ? 'text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'}`}>
 {st.title}
 </span>
 </div>
 <button
 type="button"
 onClick={() => deleteSubTask(task.id, st.id)}
 className="text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
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
 placeholder="Tambah item checklist..."
 className="flex-1 text-sm bg-white dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-200"
 />
 <Button type="submit" disabled={!newSubTask.trim()} icon={<Plus size={16} />} size="sm">
 Tambah
 </Button>
 </form>
 </div>
 ) : activeTab === 'activity' ? (
 <div className="space-y-4 min-h-[300px]">
 <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm mb-4">Riwayat Aktivitas Tugas</h3>
 {getTaskActivities(task.id).length === 0 ? (
 <p className="text-sm text-slate-500 text-center py-8">Belum ada aktivitas tercatat.</p>
 ) : (
 <div className="space-y-3">
 {getTaskActivities(task.id).map(log => (
 <div key={log.id} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 dark:border-border-color bg-slate-50 dark:bg-[#242424]/40">
 <div className="w-8 h-8 rounded-full bg-subtle dark:bg-blue-900/40 text-primary flex items-center justify-center shrink-0">
 <Activity size={15} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{log.action}</p>
 <p className="text-[10px] text-slate-400">{new Date(log.createdAt).toLocaleString()}</p>
 </div>
 </div>
 ))}
 </div>
 )}
 </div>
 ) : null}
 </div>

 {/* Footer */}
 <div className="p-4 flex justify-end gap-2.5 border-t border-slate-100 dark:border-border-color">
 <Button type="button" variant="secondary" onClick={onClose}>
 {t('common.cancel', 'Batal')}
 </Button>
 {activeTab === 'details' && (
 <Button type="submit" form="edit-task-form" disabled={!title.trim()} icon={<Save size={16} />}>
 {t('common.save', 'Simpan Perubahan')}
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
