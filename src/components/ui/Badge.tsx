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
 const baseStyles = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border border-[#E4E4E7] dark:border-[#333333] text-[10px] sm:text-[11px] font-medium transition-colors duration-300 bg-transparent text-[#71717A]';
 
 const getIndicator = () => {
 switch(variant) {
 case 'priority-high':
 case 'due-red':
 return <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] flex-shrink-0" />;
 case 'priority-medium':
 case 'due-yellow':
 return <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] flex-shrink-0" />;
 case 'priority-low':
 return <span className="w-1.5 h-1.5 rounded-full bg-[#059669] flex-shrink-0" />;
 default:
 return color ? <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} /> : null;
 }
 };

 return (
 <span
 className={twMerge(clsx(baseStyles, className))}
 >
 {getIndicator()}
 {children}
 </span>
 );
};
