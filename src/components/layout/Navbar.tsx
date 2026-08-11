import React from 'react';
import { CheckSquare } from 'lucide-react';

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-10 border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-600">
          <CheckSquare size={28} strokeWidth={2.5} />
          <span className="text-xl font-bold font-heading tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
          {/* We will add language and theme toggles here later */}
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
            R
          </div>
        </div>
      </div>
    </header>
  );
};
