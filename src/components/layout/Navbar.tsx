import React from 'react';
import { CheckSquare, Star } from 'lucide-react';
import { useGamification } from '../../hooks/useGamification';

export const Navbar: React.FC = () => {
  const { progress } = useGamification();

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-slate-200 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-600">
          <CheckSquare size={28} strokeWidth={2.5} />
          <span className="text-xl font-bold font-heading tracking-tight">TaskFlow</span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium text-slate-500">
          {/* Level indicator */}
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
            <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white text-[10px] font-black">
              {progress.level}
            </div>
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-yellow-400" />
              {progress.totalPoints}
            </span>
          </div>

          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold">
            R
          </div>
        </div>
      </div>
    </header>
  );
};

