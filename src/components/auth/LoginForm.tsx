import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock } from 'lucide-react';
import { Button } from '../ui/Button';

export const LoginForm: React.FC<{ onToggleMode: () => void }> = ({ onToggleMode }) => {
  const { login } = useAuth();
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
      setError('Invalid email or password');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-[26px] font-bold text-center text-navy dark:text-slate-100 mb-6">Welcome Back</h2>
      
      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-border-color dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-slate-700 dark:text-slate-200 transition-colors"
              placeholder="admin@taskflow.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-900 border border-border-color dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none text-slate-700 dark:text-slate-200 transition-colors"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full mt-2"
        >
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-muted mt-6">
        Don't have an account?{' '}
        <button onClick={onToggleMode} className="text-primary font-medium hover:underline">
          Register
        </button>
      </p>
    </div>
  );
};
