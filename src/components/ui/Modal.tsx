import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 children: React.ReactNode;
 className?: string;
 footer?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, className, footer }) => {
 const dialogRef = useRef<HTMLDialogElement>(null);

 useEffect(() => {
 const dialog = dialogRef.current;
 if (!dialog) return;

 if (isOpen) {
 dialog.showModal();
 } else {
 dialog.close();
 }
 }, [isOpen]);

 const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
 if (e.target === dialogRef.current) {
 onClose();
 }
 };

 if (!isOpen) return null;

 return (
 <dialog
 ref={dialogRef}
 onClick={handleBackdropClick}
 className={twMerge(
 clsx(
 'backdrop:bg-black/50 backdrop:backdrop-blur-sm',
 'm-auto rounded-lg p-0 shadow-sm border border-border-color bg-card-bg w-full max-w-md open:animate-in open:fade-in open:zoom-in-95',
 'dark:bg-[#1A1A1A] dark:border-border-color dark:text-slate-100 text-slate-800',
 className
 )
 )}
 >
 <div className="flex flex-col w-full">
 <header className="flex items-center justify-between px-5 py-4 border-b border-border-color dark:border-border-color">
 <h2 className="text-lg font-semibold text-navy dark:text-slate-50 m-0">{title}</h2>
 <button
 onClick={onClose}
 className="p-1 rounded-md text-muted hover:bg-subtle hover:text-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-300 transition-colors"
 aria-label="Close dialog"
 >
 <X size={20} />
 </button>
 </header>
 <div className="p-5">{children}</div>
 {footer && (
 <footer className="px-5 py-4 bg-slate-50 dark:bg-[#242424]/50 border-t border-border-color dark:border-border-color flex justify-end gap-3 rounded-b-xl">
 {footer}
 </footer>
 )}
 </div>
 </dialog>
 );
};
