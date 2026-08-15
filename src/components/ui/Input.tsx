import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string;
 error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, label, error, id, ...props }, ref) => {
 const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

 return (
 <div className="flex flex-col gap-1.5 w-full">
 {label && (
 <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
 {label}
 </label>
 )}
 <input
 id={inputId}
 ref={ref}
 className={twMerge(
 clsx(
 'flex h-10 w-full rounded-lg border border-border-color bg-white px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
 'dark:bg-[#1A1A1A] dark:border-border-color dark:text-slate-100',
 error && 'border-danger focus:ring-danger/50 focus:border-danger dark:border-danger/50',
 className
 )
 )}
 {...props}
 />
 {error && <span className="text-xs text-danger">{error}</span>}
 </div>
 );
 }
);
Input.displayName = 'Input';
