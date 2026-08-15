import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

export const LoginForm: React.FC<{ onToggleMode: () => void }> = ({ onToggleMode }) => {
  const { login } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (login(email, password)) {
      navigate('/dashboard');
    } else {
      setError(t('auth.invalidCredentials'));
    }
  };

  return (
    <div className="w-full flex flex-col h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('auth.welcomeBack')}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1.5 text-sm">
          Please enter your credentials to access your account.
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
            {t('auth.email')}
          </label>
          <div className="relative group">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={2} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm text-slate-900 dark:text-white transition-all duration-200"
              placeholder="admin@taskflow.com"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              {t('auth.password')}
            </label>
            <button type="button" className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors">
              Forgot password?
            </button>
          </div>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} strokeWidth={2} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-sm text-slate-900 dark:text-white transition-all duration-200"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group"
        >
          {t('auth.signIn')}
          <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
        </Button>
      </form>

      <div className="mt-6 text-center pb-2">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t('auth.noAccount')}{' '}
          <button onClick={onToggleMode} className="text-slate-900 dark:text-white font-bold hover:underline decoration-primary decoration-2 underline-offset-4">
            {t('auth.register')}
          </button>
        </p>
      </div>
    </div>
  );
};
