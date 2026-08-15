import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useMilestones } from '../../context/MilestoneContext';
import { useProjects } from '../../context/ProjectContext';
import { useTranslation } from 'react-i18next';
import type { Milestone } from '../../types';

interface MilestoneFormModalProps {
 isOpen: boolean;
 onClose: () => void;
 milestoneToEdit?: Milestone | null;
 defaultProjectId?: string;
}

export const MilestoneFormModal: React.FC<MilestoneFormModalProps> = ({ 
 isOpen, 
 onClose, 
 milestoneToEdit,
 defaultProjectId 
}) => {
 const { addMilestone, updateMilestone } = useMilestones();
 const { projects } = useProjects();
 const { t } = useTranslation();

 const [name, setName] = useState('');
 const [projectId, setProjectId] = useState('');
 const [description, setDescription] = useState('');
 const [targetDate, setTargetDate] = useState('');
 const [status, setStatus] = useState<'not_started' | 'on_track' | 'at_risk' | 'completed'>('not_started');

 useEffect(() => {
 if (isOpen) {
 if (milestoneToEdit) {
 setName(milestoneToEdit.name);
 setProjectId(milestoneToEdit.projectId);
 setDescription(milestoneToEdit.description || '');
 setTargetDate(milestoneToEdit.targetDate);
 setStatus(milestoneToEdit.status);
 } else {
 setName('');
 setProjectId(defaultProjectId || (projects.length > 0 ? projects[0].id : ''));
 setDescription('');
 setTargetDate('');
 setStatus('not_started');
 }
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = 'unset';
 }
 return () => {
 document.body.style.overflow = 'unset';
 };
 }, [isOpen, milestoneToEdit, defaultProjectId, projects]);

 if (!isOpen) return null;

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();

 if (!name.trim() || !projectId || !targetDate) return;

 if (milestoneToEdit) {
 updateMilestone(milestoneToEdit.id, {
 name: name.trim(),
 projectId,
 description: description.trim(),
 targetDate,
 status
 });
 } else {
 addMilestone({
 name: name.trim(),
 projectId,
 description: description.trim(),
 targetDate,
 status
 });
 }
 
 onClose();
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
 className="relative w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm overflow-hidden border border-border-color dark:border-border-color"
 >
 <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-border-color">
 <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
 {milestoneToEdit ? t('milestoneModal.editTitle') : t('milestoneModal.createTitle')}
 </h2>
 <button
 onClick={onClose}
 className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
 >
 <X size={20} />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-5 space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('milestoneModal.name')}
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder={t('milestoneModal.namePlaceholder')}
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100"
 required
 autoFocus
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('milestoneModal.project')}
 </label>
 <select
 value={projectId}
 onChange={(e) => setProjectId(e.target.value)}
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100"
 required
 >
 <option value="" disabled>{t('milestoneModal.selectProject')}</option>
 {projects.map(p => (
 <option key={p.id} value={p.id}>{p.name}</option>
 ))}
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('milestoneModal.targetDate')}
 </label>
 <input
 type="date"
 value={targetDate}
 onChange={(e) => setTargetDate(e.target.value)}
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100"
 required
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('milestoneModal.status')}
 </label>
 <select
 value={status}
 onChange={(e) => setStatus(e.target.value as any)}
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100"
 >
 <option value="not_started">{t('milestones.status.not_started')}</option>
 <option value="on_track">{t('milestones.status.on_track')}</option>
 <option value="at_risk">{t('milestones.status.at_risk')}</option>
 <option value="completed">{t('milestones.status.completed')}</option>
 </select>
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('milestoneModal.description')}
 </label>
 <textarea
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder={t('milestoneModal.descriptionPlaceholder')}
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100"
 />
 </div>

 <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-border-color">
 <Button type="button" variant="secondary" onClick={onClose}>
 {t('common.cancel')}
 </Button>
 <Button type="submit" disabled={!name.trim() || !projectId || !targetDate} icon={<Save size={18} />}>
 {t('milestoneModal.saveMilestone')}
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
