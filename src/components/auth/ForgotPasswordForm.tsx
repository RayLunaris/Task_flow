import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { Button } from '../ui/Button';

import emailjs from '@emailjs/browser';
import { useAuth } from '../../context/AuthContext';

export const ForgotPasswordForm: React.FC<{ onBackToLogin: () => void }> = ({ onBackToLogin }) => {
  const { t } = useTranslation();
  const { generatePasswordResetToken } = useAuth();
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setError('');
    setIsLoading(true);

    const token = generatePasswordResetToken(email);
    if (!token) {
      setError('Email tidak ditemukan di sistem.');
      setIsLoading(false);
      return;
    }

    try {
      const resetLink = `${window.location.origin}/reset-password?token=${token}`;
      
      // Mengirim ke EmailJS
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service',
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'default_template',
        {
          to_email: email,
          reset_link: resetLink
        },
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'default_key'
      );

      setIsSubmitted(true);
    } catch (err) {
      console.error("Gagal mengirim email", err);
      setError('Gagal mengirim email. Pastikan konfigurasi EmailJS di file .env sudah benar.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="w-full flex flex-col items-center text-center py-6 h-full justify-center">
        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4">
          <Mail className="text-[#0D9488]" size={24} />
        </div>
        <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#E4E4E7] mb-2">
          Periksa Email Anda
        </h2>
        <p className="text-sm text-[#71717A] mb-8">
          Kami telah mengirimkan tautan pemulihan kata sandi ke <span className="font-semibold text-[#1E293B] dark:text-[#E4E4E7]">{email}</span>
        </p>
        <Button
          onClick={onBackToLogin}
          variant="secondary"
          className="w-full py-2 flex items-center justify-center gap-2 border border-[#E2E8F0] dark:border-[#333333] text-[#1E293B] dark:text-[#E4E4E7] hover:bg-[#F1F5F9] dark:hover:bg-[#333333] transition-colors"
        >
          <ArrowLeft size={16} />
          Kembali ke Masuk
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col h-full">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-[#1E293B] dark:text-[#E4E4E7]">
          Lupa Sandi
        </h2>
        <p className="text-[#71717A] mt-1.5 text-sm">
          Masukkan email yang terdaftar untuk menerima tautan pemulihan.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4 flex-1">
        {error && (
          <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm font-medium border border-red-200 dark:border-red-900/50">
            {error}
          </div>
        )}
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
              disabled={isLoading}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full mt-6 py-2 rounded-md text-sm font-semibold shadow-sm bg-[#0D9488] hover:bg-[#0F766E] disabled:opacity-70 disabled:cursor-not-allowed text-white border-none transition-all flex items-center justify-center gap-2 group"
        >
          {isLoading ? 'Mengirim...' : 'Kirim Tautan'}
          {!isLoading && <Send size={16} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
        </Button>
      </form>

      <div className="mt-6 text-center pb-2">
        <button onClick={onBackToLogin} className="text-sm text-[#71717A] hover:text-[#1E293B] dark:hover:text-[#E4E4E7] font-medium flex items-center justify-center gap-1 mx-auto transition-colors">
          <ArrowLeft size={14} />
          Kembali ke halaman masuk
        </button>
      </div>
    </div>
  );
};
