import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, User as UserIcon, Shield, ArrowRight } from 'lucide-react';
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
    <div className="w-full flex flex-col h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('auth.createAccount')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
          Get started with TaskFlow today. It's free!
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-xl mb-5 text-sm font-medium border border-red-100 dark:border-red-900/30">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('auth.fullName')}
          </label>
          <div className="relative group">
            <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={2} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm text-slate-900 dark:text-white transition-all duration-200"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('auth.email')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={2} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm text-slate-900 dark:text-white transition-all duration-200"
              placeholder="john@taskflow.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('auth.password')}
          </label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={2} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm text-slate-900 dark:text-white transition-all duration-200"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {t('auth.role')}
          </label>
          <div className="relative group">
            <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={2} />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'member')}
              className="w-full pl-10 pr-10 py-2.5 appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm text-slate-900 dark:text-white transition-all duration-200"
            >
              <option value="member">{t('auth.roles.member')}</option>
              <option value="manager">{t('auth.roles.manager')}</option>
              <option value="admin">{t('auth.roles.admin')}</option>
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-4 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
        >
          {t('auth.signUp')}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="mt-6 text-center pb-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('auth.haveAccount')}{' '}
          <button onClick={onToggleMode} className="text-slate-900 dark:text-white font-bold hover:underline decoration-primary decoration-2 underline-offset-4">
            {t('auth.login')}
          </button>
        </p>
      </div>
    </div>
  );
};
