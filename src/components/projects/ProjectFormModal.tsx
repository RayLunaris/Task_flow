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
  '#7C3AED', '#EC4899', '#14B8A6', '#F97316', '#3B82F6', '#EF4444', '#10B981', '#8B5CF6'
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
    if (isOpen) {
      if (projectToEdit) {
        setName(projectToEdit.name);
        setDescription(projectToEdit.description || '');
        setColor(projectToEdit.color);
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, projectToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const projectData = {
      name: name.trim(),
      description: description.trim(),
      color,
      status,
      progress,
      startDate: startDate || undefined,
      dueDate: dueDate || undefined,
    };

    if (projectToEdit) {
      updateProject(projectToEdit.id, projectData);
    } else {
      addProject(projectData);
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
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {projectToEdit ? 'Edit Project' : 'Create Project'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Project Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Website Redesign"
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 text-slate-800 dark:text-slate-100 font-medium"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
                className="w-full text-sm text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 resize-none min-h-[80px]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-2">
                <Palette size={16} /> Color Theme
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
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-900 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                />
              </div>

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
                <option value="active">🟢 Active</option>
                <option value="on_hold">🟡 On Hold</option>
                <option value="completed">🔵 Completed</option>
                <option value="archived">⚪ Archived</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Progress ({progress}%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={!name.trim()} icon={<Save size={18} />}>
                {projectToEdit ? 'Save Changes' : 'Create Project'}
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
