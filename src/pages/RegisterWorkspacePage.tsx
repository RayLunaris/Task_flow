import React, { useState } from 'react';
import { Command, Building2, User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export const RegisterWorkspacePage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const [workspaceName, setWorkspaceName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Save intended workspace name for WorkspaceContext to pick up
    localStorage.setItem('pending_workspace_name', workspaceName);

    // Register user as admin. AuthContext will automatically log them in
    if (register(name, email, password, 'admin')) {
      navigate('/dashboard');
    } else {
      setError('Email sudah digunakan. Silakan gunakan email lain atau login.');
      localStorage.removeItem('pending_workspace_name');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAF9] dark:bg-[#1A1A1A] p-4 py-12 overflow-y-auto">
      <div className="w-full max-w-[480px] bg-white dark:bg-[#242424] rounded-xl p-8 shadow-sm border border-[#E2E8F0] dark:border-[#333333]">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Command size={32} className="text-[#0D9488]" strokeWidth={2.5} />
            <span className="text-3xl font-bold tracking-tight text-[#1E293B] dark:text-[#E4E4E7]">TaskFlow</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#E4E4E7]">
            Buat Workspace Baru
          </h2>
          <p className="text-[#71717A] mt-2 text-sm">
            Daftarkan perusahaan Anda dan jadilah Admin pertama.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm font-medium border border-red-200 dark:border-red-900/50 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
              Nama Perusahaan / Workspace
            </label>
            <div className="relative group">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} />
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#FAFAF9] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] rounded-md focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none text-sm text-[#1E293B] dark:text-[#E4E4E7] transition-all"
                placeholder="Acme Corp"
                required
              />
            </div>
          </div>

          <div className="pt-2 pb-2 border-t border-[#E2E8F0] dark:border-[#333333]">
            <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-4">Profil Admin</p>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
                  Nama Lengkap
                </label>
                <div className="relative group">
                  <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#FAFAF9] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] rounded-md focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none text-sm text-[#1E293B] dark:text-[#E4E4E7] transition-all"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
                  Email
                </label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#FAFAF9] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] rounded-md focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none text-sm text-[#1E293B] dark:text-[#E4E4E7] transition-all"
                    placeholder="john@acme.com"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
                  Password
                </label>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-[#FAFAF9] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] rounded-md focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none text-sm text-[#1E293B] dark:text-[#E4E4E7] transition-all"
                    placeholder="••••••••"
                    required
                    minLength={6}
                  />
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full mt-6 py-3 rounded-lg text-sm font-bold shadow-sm bg-[#0D9488] hover:bg-[#0F766E] text-white border-none transition-all flex items-center justify-center gap-2 group"
          >
            Daftar Sekarang
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#333333] text-center">
          <p className="text-sm text-[#71717A]">
            Sudah punya akun?{' '}
            <button 
              onClick={() => navigate('/find-workspace')}
              className="text-[#0D9488] font-bold hover:underline"
            >
              Kembali ke Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
