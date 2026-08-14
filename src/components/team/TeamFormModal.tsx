import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import type { User } from '../../types';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: User | null;
}

export const TeamFormModal: React.FC<TeamFormModalProps> = ({ isOpen, onClose, memberToEdit }) => {
  const { addUser, updateUser } = useAuth();
  const { t } = useTranslation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'member'>('member');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (memberToEdit) {
        setName(memberToEdit.name);
        setEmail(memberToEdit.email);
        setRole(memberToEdit.role);
        setPassword('');
      } else {
        setName('');
        setEmail('');
        setRole('member');
        setPassword('');
      }
      setError('');
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, memberToEdit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Name and Email are required.');
      return;
    }

    if (memberToEdit) {
      // Editing
      updateUser(memberToEdit.id, {
        name: name.trim(),
        email: email.trim(),
        role,
        ...(password ? { password } : {})
      });
      onClose();
    } else {
      // Adding new
      if (!password) {
        setError('Password is required for new users.');
        return;
      }
      const success = addUser(name.trim(), email.trim(), password, role);
      if (success) {
        onClose();
      } else {
        setError('Email is already in use by another user.');
      }
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
          className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {memberToEdit ? t('teamModal.editTitle') : t('teamModal.createTitle')}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-3 bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400 rounded-lg text-sm font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('teamModal.name')}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t('teamModal.namePlaceholder')}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('teamModal.email')}
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('teamModal.emailPlaceholder')}
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {t('teamModal.role')}
              </label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="member">{t('auth.roles.member')}</option>
                <option value="manager">{t('auth.roles.manager')}</option>
                <option value="admin">{t('auth.roles.admin')}</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                {memberToEdit ? t('teamModal.newPassword') : t('teamModal.password')}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-100 font-medium"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800">
              <Button type="button" variant="secondary" onClick={onClose}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={!name.trim() || !email.trim()} icon={<Save size={18} />}>
                {memberToEdit ? t('teamModal.saveChanges') : t('teamModal.addMember')}
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
