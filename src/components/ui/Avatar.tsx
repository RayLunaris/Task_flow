import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: 'xs' | 'sm' | 'md';
  src?: string;
}

const getInitials = (name: string) => {
  return name.charAt(0).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
    'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400',
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
