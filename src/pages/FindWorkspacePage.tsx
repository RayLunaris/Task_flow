import React, { useState } from 'react';
import { Command, Building2, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Workspace } from '../types';
import { Button } from '../components/ui/Button';

export const FindWorkspacePage: React.FC = () => {
  const [workspaceName, setWorkspaceName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleFindWorkspace = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simulasi Backend API call
    const savedWorkspaces = localStorage.getItem('taskflow_workspaces');
    const workspaces: Workspace[] = savedWorkspaces ? JSON.parse(savedWorkspaces) : [];

    const found = workspaces.find(w => w.name.toLowerCase() === workspaceName.toLowerCase());

    if (found) {
      // Redirect to login with workspace query param
      navigate(`/login?workspaceId=${found.id}&workspaceName=${encodeURIComponent(found.name)}`);
    } else {
      setError('Workspace tidak ditemukan. Pastikan nama yang Anda masukkan benar.');
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FAFAF9] dark:bg-[#1A1A1A] p-4">
      <div className="w-full max-w-[420px] bg-white dark:bg-[#242424] rounded-xl p-8 shadow-sm border border-[#E2E8F0] dark:border-[#333333]">
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2">
            <Command size={32} className="text-[#0D9488]" strokeWidth={2.5} />
            <span className="text-3xl font-bold tracking-tight text-[#1E293B] dark:text-[#E4E4E7]">TaskFlow</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#E4E4E7]">
            Masuk ke Workspace Anda
          </h2>
          <p className="text-[#71717A] mt-2 text-sm">
            Masukkan nama workspace / perusahaan tempat tim Anda berkolaborasi.
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm font-medium border border-red-200 dark:border-red-900/50 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleFindWorkspace} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7] flex items-center gap-2">
              <Building2 size={16} /> Nama Workspace
            </label>
            <input
              type="text"
              value={workspaceName}
              onChange={(e) => setWorkspaceName(e.target.value)}
              className="w-full px-4 py-3 bg-[#FAFAF9] dark:bg-[#1A1A1A] border border-[#E2E8F0] dark:border-[#333333] rounded-lg focus:ring-2 focus:ring-[#0D9488]/50 focus:border-[#0D9488] outline-none text-[#1E293B] dark:text-[#E4E4E7] transition-all"
              placeholder="Contoh: Acme Corp"
              required
            />
          </div>

          <Button
            type="submit"
            className="w-full py-3 rounded-lg text-sm font-bold shadow-sm bg-[#0D9488] hover:bg-[#0F766E] text-white border-none transition-all flex items-center justify-center gap-2 group"
          >
            Lanjutkan
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#333333] text-center">
          <p className="text-sm text-[#71717A]">
            Baru di TaskFlow?{' '}
            <button 
              onClick={() => navigate('/register-workspace')}
              className="text-[#0D9488] font-bold hover:underline"
            >
              Buat Workspace Baru
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
