import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  progress: number; // 0 to 100
  className?: string;
  color?: string; // Tailwind color class, e.g., 'bg-primary'
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, className, color = 'bg-primary' }) => {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={twMerge('w-full bg-[#EDE9FE] dark:bg-slate-800 rounded-full h-[5px]', className)}>
      <div
        className={clsx('h-full rounded-full transition-all duration-500 ease-out', color)}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};
