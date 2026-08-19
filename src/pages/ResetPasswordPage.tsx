import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Command, Lock, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const { validateResetToken, resetPassword } = useAuth();
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isValidating, setIsValidating] = useState(true);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setIsValidating(false);
      return;
    }

    const email = validateResetToken(token);
    if (email) {
      setIsTokenValid(true);
      setUserEmail(email);
    }
    setIsValidating(false);
  }, [token, validateResetToken]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Kata sandi harus minimal 8 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Kata sandi tidak cocok.');
      return;
    }

    resetPassword(userEmail, newPassword);
    setIsSuccess(true);
  };

  if (isValidating) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-[#FAFAF9] dark:bg-[#1A1A1A]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D9488]"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full flex bg-[#FAFAF9] dark:bg-[#1A1A1A] overflow-hidden items-center justify-center p-6">
      <div className="w-full max-w-[420px]">
        <div className="flex justify-center mb-8 mt-4">
          <div className="flex items-center gap-2">
            <Command size={28} className="text-[#0D9488]" strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight text-[#1E293B] dark:text-[#E4E4E7]">TaskFlow</span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] dark:bg-[#242424] rounded-md p-8 shadow-sm border border-[#E2E8F0] dark:border-[#333333]">
          {!isTokenValid && !isSuccess ? (
            <div className="text-center py-4">
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#E4E4E7] mb-2">Tautan Tidak Valid</h2>
              <p className="text-sm text-[#71717A] mb-6">
                Tautan pemulihan kata sandi tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white">
                Kembali ke Halaman Masuk
              </Button>
            </div>
          ) : isSuccess ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Lock className="text-[#0D9488]" size={24} />
              </div>
              <h2 className="text-xl font-bold text-[#1E293B] dark:text-[#E4E4E7] mb-2">Kata Sandi Diperbarui</h2>
              <p className="text-sm text-[#71717A] mb-6">
                Kata sandi Anda berhasil diperbarui. Silakan masuk menggunakan kata sandi baru Anda.
              </p>
              <Button onClick={() => navigate('/login')} className="w-full bg-[#0D9488] hover:bg-[#0F766E] text-white">
                Ke Halaman Masuk
              </Button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-[#1E293B] dark:text-[#E4E4E7]">
                  Buat Sandi Baru
                </h2>
                <p className="text-[#71717A] mt-1.5 text-sm">
                  Masukkan kata sandi baru untuk akun {userEmail}.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 p-3 rounded-md mb-5 text-sm font-medium border border-red-200 dark:border-red-900/50">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
                    Sandi Baru
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} strokeWidth={2} />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-[#FFFFFF] dark:bg-[#242424] border border-[#E2E8F0] dark:border-[#333333] rounded-md focus:ring-1 focus:ring-[#0D9488] focus:border-[#0D9488] outline-none text-sm text-[#1E293B] dark:text-[#E4E4E7] transition-all duration-200"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7]">
                    Konfirmasi Sandi Baru
                  </label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#71717A] group-focus-within:text-[#0D9488] transition-colors" size={18} strokeWidth={2} />
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
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
                  Simpan Sandi Baru
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
