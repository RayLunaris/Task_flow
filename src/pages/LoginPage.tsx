import React, { useState } from 'react';
import { LoginForm } from '../components/auth/LoginForm';
import { RegisterForm } from '../components/auth/RegisterForm';
import { CheckSquare } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 w-full max-w-md">
        
        <div className="flex justify-center mb-6">
          <div className="flex items-center gap-2 text-primary">
            <CheckSquare size={32} strokeWidth={2.5} />
            <span className="text-2xl font-bold tracking-tight">TaskFlow</span>
          </div>
        </div>

        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <RegisterForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  );
};
