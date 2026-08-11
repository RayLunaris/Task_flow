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
  const baseStyles = 'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium';
  
  const variants = {
    'priority-high': 'bg-red-100 text-red-800',
    'priority-medium': 'bg-yellow-100 text-yellow-800',
    'priority-low': 'bg-green-100 text-green-800',
    'category': 'bg-purple-100 text-purple-800',
    'due-red': 'bg-red-100 text-red-800',
    'due-yellow': 'bg-yellow-100 text-yellow-800',
    'due-normal': 'bg-slate-100 text-slate-800',
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
