import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { Button } from '../ui/Button';

export const RegisterForm: React.FC<{ onToggleMode: () => void }> = ({ onToggleMode }) => {
  const { register } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'manager' | 'member'>('member');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (register(name, email, password, role)) {
      navigate('/dashboard');
    } else {
      setError(t('auth.emailInUse'));
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-[26px] font-bold text-center text-navy dark:text-slate-100 mb-6">
        {t('auth.createAccount')}
      </h2>
      
      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('auth.fullName')}
          </label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-border-color dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-slate-700 dark:text-slate-200 transition-colors"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('auth.email')}
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-border-color dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-slate-700 dark:text-slate-200 transition-colors"
              placeholder="john@taskflow.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('auth.password')}
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-border-color dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-slate-700 dark:text-slate-200 transition-colors"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            {t('auth.role')}
          </label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'member')}
            className="w-full px-4 py-2 bg-white dark:bg-slate-900 border border-border-color dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-slate-700 dark:text-slate-200 transition-colors"
          >
            <option value="member">{t('auth.roles.member')}</option>
            <option value="manager">{t('auth.roles.manager')}</option>
            <option value="admin">{t('auth.roles.admin')}</option>
          </select>
        </div>

        <Button
          type="submit"
          className="w-full mt-4"
        >
          {t('auth.signUp')}
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        {t('auth.haveAccount')}{' '}
        <button onClick={onToggleMode} className="text-primary font-medium hover:underline">
          {t('auth.login')}
        </button>
      </p>
    </div>
  );
};
