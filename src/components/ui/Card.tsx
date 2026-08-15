import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
 children: React.ReactNode;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
 ({ children, className, ...props }, ref) => {
 return (
 <div
 ref={ref}
 className={twMerge(
 clsx(
 'bg-[#FFFFFF] dark:bg-[#242424] rounded-lg p-6 shadow-sm border border-[#E5E7EB] dark:border-[#333333]',
 className
 )
 )}
 {...props}
 >
 {children}
 </div>
 );
 }
);
Card.displayName = 'Card';
