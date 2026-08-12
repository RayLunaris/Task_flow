import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useMilestones } from '../../context/MilestoneContext';
import { useProjects } from '../../context/ProjectContext';
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
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {milestoneToEdit ? 'Edit Milestone' : 'Add Milestone'}
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
                Milestone Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Beta Release"
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-200 text-slate-800 dark:text-slate-100"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-200 text-slate-800 dark:text-slate-100"
                required
              >
                <option value="" disabled>Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-200 text-slate-800 dark:text-slate-100"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-200 text-slate-800 dark:text-slate-100"
              >
                <option value="not_started">⚪ Not Started</option>
                <option value="on_track">🟢 On Track</option>
                <option value="at_risk">🟠 At Risk</option>
                <option value="completed">✅ Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is the goal of this milestone?"
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 min-h-[80px] focus:outline-none focus:ring-2 focus:ring-purple-200 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={!name.trim() || !projectId || !targetDate} icon={<Save size={18} />}>
                Save Milestone
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
