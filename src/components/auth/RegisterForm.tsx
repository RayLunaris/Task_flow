import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Mail, Lock, User as UserIcon } from 'lucide-react';

export const RegisterForm: React.FC<{ onToggleMode: () => void }> = ({ onToggleMode }) => {
  const { register } = useAuth();
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
      setError('Email already in use');
    }
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-6">Create Account</h2>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
          <div className="relative">
            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-700 dark:text-slate-200"
              placeholder="John Doe"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-700 dark:text-slate-200"
              placeholder="john@taskflow.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-slate-700 dark:text-slate-200"
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Role (Simulation)</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as 'admin' | 'manager' | 'member')}
            className="w-full px-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-slate-700 dark:text-slate-200"
          >
            <option value="member">Member</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-4"
        >
          Sign Up
        </button>
      </form>

      <p className="text-center text-sm text-slate-500 mt-6">
        Already have an account?{' '}
        <button onClick={onToggleMode} className="text-purple-600 font-medium hover:underline">
          Login
        </button>
      </p>
    </div>
  );
};
