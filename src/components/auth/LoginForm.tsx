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
 <h2 className="text-2xl font-bold text-[#1E293B] dark:text-[#E4E4E7]">
 {t('auth.welcomeBack')}
 </h2>
 <p className="text-[#71717A] mt-1.5 text-sm">
 Silakan masukkan kredensial Anda untuk mengakses akun.
 </p>
 </div>
 
 {error && (
 <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm font-medium border border-red-200 dark:border-red-900/50">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-4 flex-1">
 <div className="space-y-1.5">
 <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
 {t('auth.email')}
 </label>
 <div className="relative group">
 <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} strokeWidth={2} />
 <input
 type="email"
 value={email}
 onChange={(e) => setEmail(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#242424] border border-[#E2E8F0] dark:border-[#333333] rounded-md focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none text-sm text-[#1E293B] dark:text-[#E4E4E7] transition-all duration-200"
 placeholder="admin@taskflow.com"
 required
 />
 </div>
 </div>

 <div className="space-y-1.5">
 <div className="flex justify-between items-center">
 <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
 {t('auth.password')}
 </label>
 <button type="button" className="text-xs font-semibold text-[#0D9488] hover:text-[#0F766E] transition-colors">
 Lupa sandi?
 </button>
 </div>
 <div className="relative group">
 <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} strokeWidth={2} />
 <input
 type="password"
 value={password}
 onChange={(e) => setPassword(e.target.value)}
 className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#242424] border border-[#E2E8F0] dark:border-[#333333] rounded-md focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none text-sm text-[#1E293B] dark:text-[#E4E4E7] transition-all duration-200"
 placeholder="••••••••"
 required
 />
 </div>
 </div>

 <Button
 type="submit"
 className="w-full mt-6 py-2 rounded-md text-sm font-semibold shadow-sm bg-[#0D9488] hover:bg-[#0F766E] text-white border-none transition-all flex items-center justify-center gap-2 group"
 >
 {t('auth.signIn')}
 <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
 </Button>
 </form>

 <div className="mt-6 text-center pb-2">
 <p className="text-sm text-[#71717A]">
 {t('auth.noAccount')}{' '}
 <button onClick={onToggleMode} className="text-[#0D9488] font-bold hover:underline decoration-[#0D9488] decoration-2 underline-offset-4">
 {t('auth.register')}
 </button>
 </p>
 </div>
 </div>
 );
};
