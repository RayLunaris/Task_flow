import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'priority-high' | 'priority-medium' | 'priority-low' | 'category' | 'due-red' | 'due-yellow' | 'due-normal';
  color?: string; // for custom category colors
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'category', color, className }) => {
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded-full text-[10px] sm:text-[11px] font-medium transition-colors duration-300';
  
  const variants = {
    'priority-high': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'priority-medium': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'priority-low': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'category': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    'due-red': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'due-yellow': 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'due-normal': 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <span
      className={twMerge(clsx(baseStyles, !color && variants[variant], className))}
      style={color ? { backgroundColor: `${color}20`, color: color } : undefined}
    >
      {children}
    </span>
  );
};
