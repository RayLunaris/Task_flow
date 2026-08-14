import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Save, Send, UserPlus, Mail, Copy, Check, Users, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/Button';
import { useAuth } from '../../context/AuthContext';
import type { User, UserRole, UserStatus } from '../../types';

interface TeamFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  memberToEdit?: User | null;
  initialDepartment?: string;
}

const DEPARTMENTS = [
  'Design & UI/UX',
  'Engineering',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
  'Finance',
  'Human Resources',
  'Client Partner',
  'General',
];

export const TeamFormModal: React.FC<TeamFormModalProps> = ({ isOpen, onClose, memberToEdit, initialDepartment }) => {
  const { users, user: currentUser, addUser, updateUser, inviteUser, inviteExistingUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'existing' | 'email' | 'manual'>('existing');
  
  // Form fields
  const [selectedUserId, setSelectedUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [department, setDepartment] = useState('Engineering');
  const [title, setTitle] = useState('');
  const [status, setStatus] = useState<UserStatus>('active');
  const [error, setError] = useState('');
  const [successInvite, setSuccessInvite] = useState<{ link: string; email: string; targetName?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Filter users who can be invited (exclude current user and active admin)
  const nonTeamUsers = users.filter(u => u.id !== currentUser?.id && u.status !== 'active');

  useEffect(() => {
    if (isOpen) {
      if (memberToEdit) {
        setName(memberToEdit.name);
        setEmail(memberToEdit.email);
        setRole(memberToEdit.role);
        setDepartment(memberToEdit.department || initialDepartment || 'Engineering');
        setTitle(memberToEdit.title || '');
        setStatus(memberToEdit.status || 'active');
        setPassword('');
        setActiveTab('manual');
      } else {
        setSelectedUserId(nonTeamUsers[0]?.id || users.filter(u => u.id !== currentUser?.id)[0]?.id || '');
        setName('');
        setEmail('');
        setRole('member');
        setDepartment(initialDepartment || 'Engineering');
        setTitle('');
        setStatus('active');
        setPassword('');
        setActiveTab(nonTeamUsers.length > 0 ? 'existing' : 'email');
      }
      setError('');
      setSuccessInvite(null);
      setCopied(false);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, memberToEdit]);

  if (!isOpen) return null;

  const handleExistingUserInvite = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!selectedUserId) {
      setError('Pilih salah satu akun pengguna.');
      return;
    }

    const target = users.find(u => u.id === selectedUserId);
    const result = inviteExistingUser(selectedUserId, role, department, title.trim() || target?.title);
    if (result.success) {
      setSuccessInvite({ 
        link: result.inviteLink, 
        email: target?.email || '',
        targetName: target?.name
      });
    } else {
      setError(result.error || 'Gagal mengirim undangan.');
    }
  };

  const handleEmailInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Alamat email wajib diisi.');
      return;
    }

    const result = inviteUser(email.trim(), role, department, name.trim(), title.trim());
    if (result.success) {
      setSuccessInvite({ link: result.inviteLink, email: email.trim(), targetName: name.trim() || email.trim() });
    } else {
      setError(result.error || 'Gagal mengirim undangan.');
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim()) {
      setError('Nama dan Email wajib diisi.');
      return;
    }

    if (memberToEdit) {
      updateUser(memberToEdit.id, {
        name: name.trim(),
        email: email.trim(),
        role,
        department,
        title: title.trim(),
        status,
        ...(password ? { password } : {})
      });
      onClose();
    } else {
      if (!password) {
        setError('Password wajib diisi untuk registrasi manual.');
        return;
      }
      const success = addUser(name.trim(), email.trim(), password, role, department, title.trim(), status);
      if (success) {
        onClose();
      } else {
        setError('Email sudah terdaftar pada workspace ini.');
      }
    }
  };

  const handleCopyLink = () => {
    if (successInvite?.link && navigator.clipboard) {
      navigator.clipboard.writeText(successInvite.link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
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
          className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UserPlus className="text-primary" size={20} />
              {memberToEdit ? 'Edit Profil Anggota' : 'Undang Anggota ke Tim'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:text-slate-300 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Mode Tabs (Only when creating new member) */}
          {!memberToEdit && !successInvite && (
            <div className="flex border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 p-1 m-4 mb-0 rounded-xl">
              <button
                type="button"
                onClick={() => setActiveTab('existing')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'existing'
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Users size={14} />
                Pilih Akun Terdaftar
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('email')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'email'
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <Mail size={14} />
                Undang via Email
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('manual')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                  activeTab === 'manual'
                    ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                    : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                <UserCheck size={14} />
                Input Manual
              </button>
            </div>
          )}

          {/* Success Invite View */}
          {successInvite ? (
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto shadow-inner">
                <Check size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Undangan Berhasil Dikirim!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Notifikasi undangan telah dikirimkan ke akun <strong className="text-slate-700 dark:text-slate-200">{successInvite.targetName || successInvite.email}</strong>. Pengguna dapat memilih untuk bergabung atau menolak di halaman notifikasinya.
                </p>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 text-left space-y-2">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Link Undangan Registrasi (Opsional):</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={successInvite.link}
                    className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg py-1.5 px-2.5 text-xs text-slate-600 dark:text-slate-300 select-all font-mono"
                  />
                  <Button type="button" size="sm" onClick={handleCopyLink} icon={copied ? <Check size={14} /> : <Copy size={14} />}>
                    {copied ? 'Tersalin' : 'Salin'}
                  </Button>
                </div>
              </div>

              <div className="pt-2">
                <Button type="button" variant="secondary" onClick={onClose} className="w-full">
                  Selesai
                </Button>
              </div>
            </div>
          ) : activeTab === 'existing' && !memberToEdit ? (
            /* Invite Existing Registered Account */
            <form onSubmit={handleExistingUserInvite} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-medium border border-red-200/60">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Pilih Akun Pengguna *
                </label>
                <select
                  value={selectedUserId}
                  onChange={(e) => setSelectedUserId(e.target.value)}
                  className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium"
                >
                  <option value="">-- Pilih Akun yang Ingin Diundang --</option>
                  {users.filter(u => u.id !== currentUser?.id && u.status !== 'active').map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email}) {u.status === 'invited' ? '• [Menunggu Respon]' : u.status === 'declined' ? '• [Pernah Menolak]' : '• [Belum Diundang]'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Akun yang dipilih akan menerima kartu undangan interaktif di halaman notifikasinya untuk bergabung atau menolak.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Departemen / Divisi
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Peran / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                  >
                    <option value="member">Team Member</option>
                    <option value="manager">Project Manager</option>
                    <option value="client">Client / Viewer</option>
                    <option value="admin">Admin / Owner</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Jabatan (Title)
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Senior Frontend Developer"
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" icon={<Send size={16} />} disabled={!selectedUserId}>
                  Kirim Undangan ke Akun
                </Button>
              </div>
            </form>
          ) : activeTab === 'email' && !memberToEdit ? (
            /* Invite via Email Form */
            <form onSubmit={handleEmailInviteSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-medium border border-red-200/60">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  Email Calon Anggota *
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@company.com"
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Nama Lengkap (Opsional)
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Jabatan / Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Dev"
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Departemen / Divisi
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Peran / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                  >
                    <option value="member">Team Member</option>
                    <option value="manager">Project Manager</option>
                    <option value="client">Client / Viewer</option>
                    <option value="admin">Admin / Owner</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" icon={<Send size={16} />} disabled={!email.trim()}>
                  Kirim Undangan Email
                </Button>
              </div>
            </form>
          ) : (
            /* Manual Registration / Edit Form */
            <form onSubmit={handleManualSubmit} className="p-5 space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 rounded-xl text-xs font-medium border border-red-200/60">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Nama Lengkap *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Marcus Chen"
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="marcus@company.com"
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Departemen / Divisi
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    {DEPARTMENTS.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Jabatan (Title)
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. UI/UX Lead"
                    className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Peran / Role
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold"
                  >
                    <option value="member">Team Member</option>
                    <option value="manager">Project Manager</option>
                    <option value="client">Client / Viewer</option>
                    <option value="admin">Admin / Owner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                    Status Keanggotaan
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus)}
                    className="w-full text-sm border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200"
                  >
                    <option value="active">Active (Resmi Bergabung)</option>
                    <option value="invited">Invited (Menunggu Respon)</option>
                    <option value="declined">Declined (Undangan Ditolak)</option>
                    <option value="inactive">Inactive (Nonaktif)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1">
                  {memberToEdit ? 'Password Baru (Kosongkan jika tidak diubah)' : 'Password Awal *'}
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2.5 border-t border-slate-100 dark:border-slate-800">
                <Button type="button" variant="secondary" onClick={onClose}>
                  Batal
                </Button>
                <Button type="submit" icon={<Save size={16} />}>
                  {memberToEdit ? 'Simpan Perubahan' : 'Daftarkan Anggota'}
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );

  if (typeof document !== 'undefined') {
    return createPortal(modalContent, document.body);
  }
  return null;
};
