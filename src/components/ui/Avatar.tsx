import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
 name: string;
 size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
 src?: string;
}

const getInitials = (name: string) => {
 return name.charAt(0).toUpperCase();
};

const getAvatarColor = (name: string) => {
 const colors = [
 'bg-subtle text-primary dark:bg-blue-900/30 dark:text-primary',
 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400',
 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400',
 ];
 let sum = 0;
 for (let i = 0; i < name.length; i++) {
 sum += name.charCodeAt(i);
 }
 return colors[sum % colors.length];
};

export const Avatar: React.FC<AvatarProps> = ({ name, size = 'sm', src, className, ...props }) => {
 const sizeClasses = {
 xs: 'w-[22px] h-[22px] text-[10px]',
 sm: 'w-[32px] h-[32px] text-xs',
 md: 'w-[44px] h-[44px] text-sm',
 lg: 'w-[64px] h-[64px] text-lg',
 xl: 'w-[96px] h-[96px] text-2xl',
 };

 return (
 <div
 className={twMerge(
 clsx(
 'rounded-full flex items-center justify-center font-bold flex-shrink-0',
 !src && getAvatarColor(name),
 sizeClasses[size],
 className
 )
 )}
 {...props}
 >
 {src ? (
 <img src={src} alt={name} className="w-full h-full rounded-full object-cover" />
 ) : (
 getInitials(name)
 )}
 </div>
 );
};
