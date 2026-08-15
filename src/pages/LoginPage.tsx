import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { Command } from 'lucide-react';
import AuthSwitch from '../components/ui/auth-switch';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage: React.FC = () => {
 const [isLogin, setIsLogin] = useState(true);

 return (
 <div className="h-screen w-full flex bg-[#FAFAF9] dark:bg-[#1A1A1A] overflow-hidden">
 
 {/* Left side: Branding / Decorative (Hidden on mobile) */}
 <div className="hidden lg:flex flex-col justify-between lg:w-[40%] bg-[#0F172A] p-12 relative overflow-hidden h-full">

 {/* Brand Header */}
 <div className="relative z-10 flex items-center gap-2">
 <Command size={28} className="text-[#0D9488]" strokeWidth={2.5} />
 <span className="text-2xl font-bold tracking-tight text-[#F1F5F9]">TaskFlow</span>
 </div>

 {/* Hero Content */}
 <div className="relative z-10 max-w-md">
 <h1 className="text-3xl lg:text-4xl font-extrabold text-[#F1F5F9] leading-tight mb-4">
 Satu Papan Kerja untuk <br />
 <span className="text-[#0D9488]">Sinkronisasi Tim.</span>
 </h1>
 <p className="text-base text-[#94A3B8] font-medium mb-10 leading-relaxed">
 Hapus kebisingan. Buat tugas, tetapkan tenggat waktu, dan lihat status pekerjaan tim Anda secara real-time tanpa rapat tambahan.
 </p>

 <ul className="space-y-4 text-[#94A3B8] text-sm">
 <li className="flex items-start gap-3">
 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0D9488] flex-shrink-0" />
 <span><strong className="text-[#F1F5F9] font-semibold">Papan Kanban</strong> &mdash; Pindahkan status tugas dengan mulus.</span>
 </li>
 <li className="flex items-start gap-3">
 <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#0D9488] flex-shrink-0" />
 <span><strong className="text-[#F1F5F9] font-semibold">Laporan Metrik</strong> &mdash; Pantau kapasitas beban kerja tim.</span>
 </li>
 </ul>
 </div>

 {/* Footer info */}
 <div className="relative z-10">
 <p className="text-xs text-[#94A3B8]">
 &copy; {new Date().getFullYear()} TaskFlow. All rights reserved.
 </p>
 </div>
 </div>

 {/* Right side: Auth Form */}
 <div className="flex-1 lg:w-[60%] h-full overflow-y-auto flex flex-col p-6 sm:p-12">
 <div className="w-full max-w-[420px] m-auto">
 
 {/* Mobile Header (Only visible on small screens) */}
 <div className="flex lg:hidden justify-center mb-8 mt-4">
 <div className="flex items-center gap-2">
 <Command size={28} className="text-[#0D9488]" strokeWidth={2.5} />
 <span className="text-2xl font-bold tracking-tight text-[#1E293B] dark:text-[#E4E4E7]">TaskFlow</span>
 </div>
 </div>

 {/* Form Card */}
 <div className="bg-[#FFFFFF] dark:bg-[#242424] rounded-md p-8 shadow-sm border border-[#E2E8F0] dark:border-[#333333] my-4">
 
 <div className="mb-6">
 <AuthSwitch isLogin={isLogin} onToggle={(val) => setIsLogin(val)} />
 </div>

 <div className="relative">
 <AnimatePresence mode="wait">
 <motion.div
 key={isLogin ? 'login' : 'register'}
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -10 }}
 transition={{ duration: 0.25, ease: 'easeOut' }}
 >
 {isLogin ? (
 <LoginForm onToggleMode={() => setIsLogin(false)} />
 ) : (
 <RegisterForm onToggleMode={() => setIsLogin(true)} />
 )}
 </motion.div>
 </AnimatePresence>
 </div>
 
 </div>
 </div>
 </div>

 </div>
 );
};
