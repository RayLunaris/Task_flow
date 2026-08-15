import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, FolderPlus, Palette, Code2, Rocket, Megaphone, Briefcase, Users, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import type { Department, User } from '../../types';

interface DepartmentFormModalProps {
 isOpen: boolean;
 onClose: () => void;
 onSave: (department: Department) => void;
 users: User[];
 departmentToEdit?: Department | null;
}

const AVAILABLE_ICONS = [
 { id: 'Palette', label: 'Design / UI/UX', icon: Palette },
 { id: 'Code2', label: 'Engineering / Dev', icon: Code2 },
 { id: 'Rocket', label: 'Product / Launch', icon: Rocket },
 { id: 'Megaphone', label: 'Marketing / Growth', icon: Megaphone },
 { id: 'Briefcase', label: 'Management / Ops', icon: Briefcase },
 { id: 'Users', label: 'Partner / Client', icon: Users },
 { id: 'Shield', label: 'Security / QA', icon: Shield },
];

const AVAILABLE_COLORS = [
 { id: 'purple', label: 'Ungu', bg: 'bg-primary' },
 { id: 'blue', label: 'Biru', bg: 'bg-primary' },
 { id: 'teal', label: 'Teal', bg: 'bg-teal-500' },
 { id: 'amber', label: 'Amber', bg: 'bg-amber-500' },
 { id: 'pink', label: 'Pink', bg: 'bg-pink-500' },
 { id: 'indigo', label: 'Indigo', bg: 'bg-primary' },
];

export const DepartmentFormModal: React.FC<DepartmentFormModalProps> = ({
 isOpen,
 onClose,
 onSave,
 users,
 departmentToEdit,
}) => {
 const [name, setName] = useState('');
 const [description, setDescription] = useState('');
 const [icon, setIcon] = useState('Palette');
 const [color, setColor] = useState('purple');
 const [leadId, setLeadId] = useState('');
 const [error, setError] = useState('');

 useEffect(() => {
 if (isOpen) {
 if (departmentToEdit) {
 setName(departmentToEdit.name);
 setDescription(departmentToEdit.description || '');
 setIcon(departmentToEdit.icon || 'Palette');
 setColor(departmentToEdit.color || 'purple');
 setLeadId(departmentToEdit.leadId || '');
 } else {
 setName('');
 setDescription('');
 setIcon('Palette');
 setColor('purple');
 setLeadId('');
 }
 setError('');
 document.body.style.overflow = 'hidden';
 } else {
 document.body.style.overflow = 'unset';
 }
 return () => {
 document.body.style.overflow = 'unset';
 };
 }, [isOpen, departmentToEdit]);

 if (!isOpen) return null;

 const handleSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!name.trim()) {
 setError('Nama divisi/tim wajib diisi.');
 return;
 }

 const dept: Department = {
 id: departmentToEdit ? departmentToEdit.id : 'dept-' + crypto.randomUUID().slice(0, 8),
 name: name.trim(),
 description: description.trim(),
 icon,
 color,
 leadId: leadId || undefined,
 createdAt: departmentToEdit?.createdAt || new Date().toISOString(),
 };

 onSave(dept);
 onClose();
 };

 const modalContent = (
 <AnimatePresence>
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
 onClick={onClose}
 />

 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-md bg-white dark:bg-[#1A1A1A] rounded-lg shadow-sm overflow-hidden border border-border-color dark:border-border-color"
 >
 {/* Header */}
 <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-border-color">
 <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
 <FolderPlus className="text-primary" size={18} />
 {departmentToEdit ? 'Edit Divisi / Tim' : 'Buat Divisi / Tim Baru'}
 </h2>
 <button
 onClick={onClose}
 className="p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
 >
 <X size={18} />
 </button>
 </div>

 <form onSubmit={handleSubmit} className="p-5 space-y-4">
 {error && (
 <div className="p-3 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-lg text-xs font-medium border border-red-200/60">
 {error}
 </div>
 )}

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Nama Divisi / Tim *
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 placeholder="e.g. Design & UI/UX, Data Science, QA"
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
 autoFocus
 />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Deskripsi Singkat
 </label>
 <textarea
 rows={2}
 value={description}
 onChange={(e) => setDescription(e.target.value)}
 placeholder="Fokus dan tanggung jawab divisi ini..."
 className="w-full text-sm bg-slate-50 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100 resize-none"
 />
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
 Pilih Ikon Divisi
 </label>
 <div className="grid grid-cols-4 gap-2">
 {AVAILABLE_ICONS.map((item) => {
 const IconComp = item.icon;
 const isSelected = icon.toLowerCase() === item.id.toLowerCase();
 return (
 <button
 key={item.id}
 type="button"
 onClick={() => setIcon(item.id)}
 className={`p-2.5 rounded-lg border flex flex-col items-center gap-1 transition-all cursor-pointer ${
 isSelected
 ? 'border-primary bg-primary/10 text-primary shadow-xs ring-1 ring-primary'
 : 'border-border-color dark:border-border-color hover:border-slate-300 text-slate-500'
 }`}
 >
 <IconComp size={18} />
 <span className="text-[9px] font-bold truncate max-w-full">{item.label.split('/')[0]}</span>
 </button>
 );
 })}
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
 Warna Tema
 </label>
 <div className="flex items-center gap-3">
 {AVAILABLE_COLORS.map((c) => (
 <button
 key={c.id}
 type="button"
 onClick={() => setColor(c.id)}
 className={`w-7 h-7 rounded-full ${c.bg} transition-all cursor-pointer flex items-center justify-center ${
 color === c.id ? 'ring-2 ring-offset-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'
 }`}
 title={c.label}
 />
 ))}
 </div>
 </div>

 <div>
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
 Ketua Tim / Team Lead (Opsional)
 </label>
 <select
 value={leadId}
 onChange={(e) => setLeadId(e.target.value)}
 className="w-full text-sm border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-[#242424] text-slate-700 dark:text-slate-200"
 >
 <option value="">-- Pilih Team Lead --</option>
 {users.map((u) => (
 <option key={u.id} value={u.id}>
 {u.name} ({u.email}) - {u.role}
 </option>
 ))}
 </select>
 </div>

 <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100 dark:border-border-color">
 <Button type="button" variant="secondary" onClick={onClose}>
 Batal
 </Button>
 <Button type="submit" icon={<Save size={16} />}>
 {departmentToEdit ? 'Simpan Divisi' : 'Buat Divisi'}
 </Button>
 </div>
 </form>
 </motion.div>
 </div>
 </AnimatePresence>
 );

 if (typeof document !== 'undefined') {
 return createPortal(modalContent, document.body);
 }
 return null;
};
