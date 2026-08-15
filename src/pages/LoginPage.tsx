import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { CheckSquare } from 'lucide-react';
import AuthSwitch from '../components/ui/auth-switch';
import { motion, AnimatePresence } from 'framer-motion';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-slate-950 overflow-hidden">
      
      {/* Left side: Branding / Decorative (Hidden on mobile) */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-navy dark:bg-slate-900 p-12 relative overflow-hidden h-full">
        {/* Background Decorative Elements (Removed for solid design) */}

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="p-2 bg-primary rounded-xl shadow-lg shadow-primary/20">
            <CheckSquare size={32} strokeWidth={2.5} className="text-white" />
          </div>
          <span className="text-3xl font-bold tracking-tight">TaskFlow</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Streamline your workflow, <br />
            <span className="text-sky-400">master your time.</span>
          </h1>
          <p className="text-lg text-slate-300 font-medium">
            Join thousands of teams who are already organizing their work and collaborating more effectively with TaskFlow.
          </p>
        </div>

        {/* Footer info */}
        <div className="relative z-10">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} TaskFlow Inc. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="flex-1 h-full overflow-y-auto flex flex-col p-6 sm:p-12">
        <div className="w-full max-w-[440px] m-auto">
          
          {/* Mobile Header (Only visible on small screens) */}
          <div className="flex lg:hidden justify-center mb-8 mt-4">
            <div className="flex items-center gap-2 text-primary">
              <CheckSquare size={36} strokeWidth={2.5} />
              <span className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">TaskFlow</span>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-slate-100 dark:border-slate-800 my-4">
            
            <div className="mb-6">
              <AuthSwitch isLogin={isLogin} onToggle={(val) => setIsLogin(val)} />
            </div>

            <div className="relative min-h-[380px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={isLogin ? 'login' : 'register'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className="absolute inset-x-0 top-0"
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
