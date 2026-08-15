import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Palette } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Button } from '../ui/Button';
import { useProjects } from '../../context/ProjectContext';
import type { Project } from '../../types';

interface ProjectFormModalProps {
 isOpen: boolean;
 onClose: () => void;
 projectToEdit?: Project | null;
}

const COLORS = [
 '#2196F3', '#0D47A1', '#90CAF9', '#14B8A6', '#10B981', '#F97316', '#EF4444', '#64748B'
];

export const ProjectFormModal: React.FC<ProjectFormModalProps> = ({ isOpen, onClose, projectToEdit }) => {
 const { addProject, updateProject } = useProjects();
 const { t } = useTranslation();

 const [name, setName] = useState('');
 const [description, setDescription] = useState('');
 const [color, setColor] = useState(COLORS[0]);
 const [status, setStatus] = useState<'active' | 'on_hold' | 'completed' | 'archived'>('active');
 const [progress, setProgress] = useState(0);
 const [startDate, setStartDate] = useState('');
 const [dueDate, setDueDate] = useState('');

 useEffect(() => {
 if (projectToEdit) {
 setName(projectToEdit.name);
 setDescription(projectToEdit.description || '');
 setColor(projectToEdit.color || COLORS[0]);
 setStatus(projectToEdit.status);
 setProgress(projectToEdit.progress || 0);
 setStartDate(projectToEdit.startDate || '');
 setDueDate(projectToEdit.dueDate || '');
 } else {
 setName('');
 setDescription('');
 setColor(COLORS[0]);
 setStatus('active');
 setProgress(0);
 setStartDate('');
 setDueDate('');
 }
 }, [projectToEdit, isOpen]);

 if (!isOpen) return null;

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!name.trim()) return;

 if (projectToEdit) {
 updateProject(projectToEdit.id, {
 name: name.trim(),
 description: description.trim() || undefined,
 color,
 status,
 progress,
 startDate: startDate || undefined,
 dueDate: dueDate || undefined,
 });
 } else {
 addProject({
 name: name.trim(),
 description: description.trim() || undefined,
 color,
 status,
 progress,
 startDate: startDate || undefined,
 dueDate: dueDate || undefined,
 });
 }

 onClose();
 };

 const modalContent = (
 <AnimatePresence>
 <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
 <motion.div
 initial={{ opacity: 0, scale: 0.95 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.95 }}
 className="bg-white dark:bg-[#1A1A1A] rounded-lg w-full max-w-md shadow-sm overflow-hidden border border-slate-100 dark:border-border-color"
 >
 <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-border-color">
 <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
 {projectToEdit ? t('projectModal.editTitle') : t('projectModal.createTitle')}
 </h2>
 <button
 onClick={onClose}
 className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 rounded-lg transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-6 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('projectModal.name')}
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder={t('projectModal.namePlaceholder')}
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
 autoFocus
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('projectModal.description')}
 </label>
 <textarea
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder={t('projectModal.descriptionPlaceholder')}
 className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-[#242424] p-3 rounded-lg border border-border-color dark:border-border-color focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary resize-none min-h-[80px]"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
 <Palette size={16} /> {t('projectModal.colorTheme')}
 </label>
 <div className="flex flex-wrap gap-3">
 {COLORS.map((c) => (
 <button
 key={c}
 type="button"
 onClick={() => setColor(c)}
 className="w-8 h-8 rounded-full transition-transform hover:scale-110 flex items-center justify-center"
 style={{ backgroundColor: c }}
 >
 {color === c && (
 <div className="w-3 h-3 bg-white rounded-full" />
 )}
 </button>
 ))}
 </div>
 </div>
 
 <div className="grid grid-cols-2 gap-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('projectModal.startDate')}
 </label>
 <input
 type="date"
 value={startDate}
 onChange={(e) => setStartDate(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('projectModal.dueDate')}
 </label>
 <input
 type="date"
 value={dueDate}
 onChange={(e) => setDueDate(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
 />
 </div>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('projectModal.status')}
 </label>
 <select
 value={status}
 onChange={(e) => setStatus(e.target.value as any)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200 font-medium"
 >
 <option value="active">🟢 {t('projects.status.active')}</option>
 <option value="on_hold">🟡 {t('projects.status.on_hold')}</option>
 <option value="completed">🔵 {t('projects.status.completed')}</option>
 <option value="archived">⚪ {t('projects.status.archived')}</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('projectModal.progress')} ({progress}%)
 </label>
 <input
 type="range"
 min="0"
 max="100"
 value={progress}
 onChange={(e) => setProgress(Number(e.target.value))}
 className="w-full accent-primary"
 />
 </div>

 <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-border-color">
 <Button type="button" variant="secondary" onClick={onClose}>
 {t('common.cancel')}
 </Button>
 <Button type="submit" disabled={!name.trim()} icon={<Save size={18} />}>
 {projectToEdit ? t('projectModal.saveButton') : t('projectModal.createButton')}
 </Button>
 </div>
 </form>
 </motion.div>
 </div>
 </AnimatePresence>
 );

 if (typeof document !== 'undefined') {
 return createPortal(modalContent, document.body);
 }
 return null;
};
