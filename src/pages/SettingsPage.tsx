import React, { useState, useEffect, useRef } from 'react';
import { User, Settings, Globe, Moon, Sun, Save, Bell, Camera, Trash2, Check, Sparkles, AlertCircle, Building } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';

export const SettingsPage: React.FC = () => {
 const { user, updateUser } = useAuth();
 const isAdmin = user?.role === 'admin';
 const { t, i18n } = useTranslation();

 const [name, setName] = useState(user?.name || '');
 const [department, setDepartment] = useState(user?.department || '');
 const [avatar, setAvatar] = useState(user?.avatar || '');
 const [saveSuccess, setSaveSuccess] = useState(false);
 const [errorMessage, setErrorMessage] = useState('');
 const fileInputRef = useRef<HTMLInputElement>(null);

 // Company Settings State
 const [companyName, setCompanyName] = useState('');
 const [companyAddress, setCompanyAddress] = useState('');
 const [companyContact, setCompanyContact] = useState('');
 const [companyWebsite, setCompanyWebsite] = useState('');
 const [companySaveSuccess, setCompanySaveSuccess] = useState(false);

 useEffect(() => {
   try {
     const stored = localStorage.getItem('taskflow_company_settings');
     if (stored) {
       const parsed = JSON.parse(stored);
       setCompanyName(parsed.companyName || '');
       setCompanyAddress(parsed.companyAddress || '');
       setCompanyContact(parsed.companyContact || '');
       setCompanyWebsite(parsed.companyWebsite || '');
     }
   } catch (e) {
     console.error('Error loading company settings', e);
   }
 }, []);

 const handleSaveCompany = (e: React.FormEvent) => {
   e.preventDefault();
   const data = {
     companyName,
     companyAddress,
     companyContact,
     companyWebsite
   };
   localStorage.setItem('taskflow_company_settings', JSON.stringify(data));
   setCompanySaveSuccess(true);
   setTimeout(() => setCompanySaveSuccess(false), 3500);
 };

 // Sync state if user changes
 useEffect(() => {
 if (user) {
 setName(user.name || '');
 setDepartment(user.department || '');
 setAvatar(user.avatar || '');
 }
 }, [user]);
 
 // App Settings State
 const [theme, setTheme] = useState<'light' | 'dark'>(() => {
 if (typeof window !== 'undefined') {
 return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
 }
 return 'light';
 });
 
 const [language, setLanguage] = useState(i18n.language || 'id');
 const [notificationsEnabled, setNotificationsEnabled] = useState(true);

 // Sync language state if changed elsewhere (e.g. Navbar)
 useEffect(() => {
 setLanguage(i18n.language);
 }, [i18n.language]);

 // Apply theme changes
 useEffect(() => {
 if (theme === 'dark') {
 document.documentElement.classList.add('dark');
 } else {
 document.documentElement.classList.remove('dark');
 }
 localStorage.setItem('taskflow_theme', theme);
 }, [theme]);

 // Apply language changes
 const handleLanguageChange = (newLang: string) => {
 setLanguage(newLang);
 i18n.changeLanguage(newLang);
 };

 // Helper to compress local image files into efficient Base64 Data URL
 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;

 // Check size limit: 5MB
 if (file.size > 5 * 1024 * 1024) {
 setErrorMessage(t('settings.fileTooLarge'));
 setTimeout(() => setErrorMessage(''), 4000);
 return;
 }

 const reader = new FileReader();
 reader.onload = (event) => {
 const img = new Image();
 img.onload = () => {
 const canvas = document.createElement('canvas');
 const MAX_DIM = 256;
 let width = img.width;
 let height = img.height;

 if (width > height) {
 if (width > MAX_DIM) {
 height = Math.round((height * MAX_DIM) / width);
 width = MAX_DIM;
 }
 } else {
 if (height > MAX_DIM) {
 width = Math.round((width * MAX_DIM) / height);
 height = MAX_DIM;
 }
 }

 canvas.width = width;
 canvas.height = height;
 const ctx = canvas.getContext('2d');
 if (ctx) {
 ctx.drawImage(img, 0, 0, width, height);
 const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
 setAvatar(compressedDataUrl);
 setErrorMessage('');
 } else {
 setAvatar(event.target?.result as string);
 }
 };
 img.src = event.target?.result as string;
 };
 reader.readAsDataURL(file);
 // Reset file input so selecting the same file again triggers onChange
 e.target.value = '';
 };

 const handleRemoveAvatar = () => {
 setAvatar('');
 };

 const handleSelectPreset = (url: string) => {
 setAvatar(url);
 };

 const presetAvatars = [
 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
 ];

 const handleSaveProfile = (e: React.FormEvent) => {
 e.preventDefault();
 if (user) {
 updateUser(user.id, { name, department, avatar });
 setSaveSuccess(true);
 setTimeout(() => setSaveSuccess(false), 3500);
 }
 };

 return (
 <div className="p-8 max-w-4xl mx-auto space-y-8">
 <div>
 <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
 <Settings className="text-primary" />
 {t('settings.title')}
 </h1>
 <p className="text-slate-500 mt-1">{t('settings.subtitle')}</p>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Profile Settings */}
 <div className="bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-border-color dark:border-border-color overflow-hidden">
 <div className="p-6 border-b border-slate-100 dark:border-border-color/50 flex items-center gap-2">
 <User className="text-primary" size={20} />
 <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings.userProfile')}</h2>
 </div>
 <div className="p-6">
 {saveSuccess && (
 <div className="mb-5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in slide-in-">
 <Check size={16} className="text-emerald-500 flex-shrink-0" />
 <span>{t('settings.profileUpdated')}</span>
 </div>
 )}

 {errorMessage && (
 <div className="mb-5 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 text-red-700 dark:text-red-300 text-sm flex items-center gap-2">
 <AlertCircle size={16} className="text-red-500 flex-shrink-0" />
 <span>{errorMessage}</span>
 </div>
 )}

 {/* Avatar Management Section */}
 <div className="mb-6 p-4 rounded-lg bg-slate-50 dark:bg-[#1A1A1A]/40 border border-border-color dark:border-border-color/60">
 <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
 {t('settings.avatar')}
 </label>

 <div className="flex flex-col sm:flex-row items-center gap-4">
 <div className="relative group shrink-0">
 <Avatar 
 name={name || user?.name || 'U'} 
 src={avatar} 
 size="xl" 
 className="ring-4 ring-white dark:ring-slate-800 shadow-md"
 />
 <button
 type="button"
 onClick={() => fileInputRef.current?.click()}
 className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
 title={t('settings.uploadAvatar')}
 >
 <Camera size={22} />
 </button>
 </div>

 <div className="flex-1 space-y-2 text-center sm:text-left">
 <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
 <input 
 type="file" 
 ref={fileInputRef} 
 onChange={handleFileChange} 
 accept="image/png, image/jpeg, image/webp, image/gif, image/svg+xml" 
 className="hidden" 
 />
 <Button
 type="button"
 variant="secondary"
 size="sm"
 icon={<Camera size={14} />}
 onClick={() => fileInputRef.current?.click()}
 >
 {t('settings.uploadAvatar')}
 </Button>

 {avatar && (
 <Button
 type="button"
 variant="ghost"
 size="sm"
 icon={<Trash2 size={14} />}
 onClick={handleRemoveAvatar}
 className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
 >
 {t('settings.removeAvatar')}
 </Button>
 )}
 </div>
 <p className="text-xs text-slate-500 dark:text-slate-400">
 {t('settings.avatarDesc')}
 </p>
 </div>
 </div>

 {/* Preset Avatars */}
 <div className="mt-4 pt-3 border-t border-border-color/80 dark:border-border-color/60">
 <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-2">
 <Sparkles size={13} className="text-primary" />
 <span>{t('settings.orPresets')}</span>
 </div>
 <div className="flex flex-wrap gap-2">
 {presetAvatars.map((presetUrl, idx) => (
 <button
 key={idx}
 type="button"
 onClick={() => handleSelectPreset(presetUrl)}
 className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all cursor-pointer ${
 avatar === presetUrl 
 ? 'border-primary ring-2 ring-primary/40 scale-105' 
 : 'border-border-color dark:border-border-color hover:border-primary/60 opacity-80 hover:opacity-100'
 }`}
 >
 <img src={presetUrl} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
 </button>
 ))}
 </div>
 </div>
 </div>

 <form onSubmit={handleSaveProfile} className="space-y-4">
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('settings.fullName')}
 </label>
 <input
 type="text"
 value={name}
 onChange={(e) => setName(e.target.value)}
 className="w-full text-sm bg-slate-50 dark:bg-[#1A1A1A]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
 />
 </div>
 
 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('settings.department')}
 </label>
 <input
 type="text"
 value={department}
 onChange={(e) => setDepartment(e.target.value)}
 placeholder="e.g. Engineering"
 className="w-full text-sm bg-slate-50 dark:bg-[#1A1A1A]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
 />
 </div>

 <div>
 <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
 {t('settings.email')}
 </label>
 <input
 type="email"
 value={user?.email || ''}
 disabled
 className="w-full text-sm bg-slate-100 dark:bg-[#242424] border border-border-color dark:border-border-color rounded-lg p-2.5 text-slate-500 cursor-not-allowed"
 />
 </div>

 <div className="pt-2">
 <Button type="submit" icon={<Save size={16} />}>
 {t('settings.saveProfile')}
 </Button>
 </div>
 </form>
 </div>
 </div>

 {/* Application Settings */}
 <div className="bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-border-color dark:border-border-color overflow-hidden h-fit">
 <div className="p-6 border-b border-slate-100 dark:border-border-color/50 flex items-center gap-2">
 <Settings className="text-primary" size={20} />
 <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{t('settings.preferences')}</h2>
 </div>
 <div className="p-6 space-y-6">
 
 {/* Theme Toggle */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-[#E3F2FD] text-[#0D47A1] dark:bg-blue-900/50 dark:text-primary' : 'bg-orange-100 text-orange-600'}`}>
 {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
 </div>
 <div>
 <p className="font-medium text-slate-800 dark:text-slate-200">{t('settings.appearance')}</p>
 <p className="text-xs text-slate-500">{t('settings.appearanceDesc')}</p>
 </div>
 </div>
 <button
 onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}
 className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 bg-primary"
 >
 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
 </button>
 </div>

 {/* Language Selection */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-lg bg-subtle text-primary dark:bg-blue-900/50 dark:text-primary">
 <Globe size={20} />
 </div>
 <div>
 <p className="font-medium text-slate-800 dark:text-slate-200">{t('settings.language')}</p>
 <p className="text-xs text-slate-500">{t('settings.languageDesc')}</p>
 </div>
 </div>
 <select
 value={language}
 onChange={(e) => handleLanguageChange(e.target.value)}
 className="text-sm bg-slate-50 dark:bg-[#1A1A1A]/50 border border-border-color dark:border-border-color rounded-lg py-1.5 px-3 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200"
 >
 <option value="en">English</option>
 <option value="id">Bahasa Indonesia</option>
 </select>
 </div>

 {/* Notifications Toggle */}
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="p-2 rounded-lg bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400">
 <Bell size={20} />
 </div>
 <div>
 <p className="font-medium text-slate-800 dark:text-slate-200">{t('settings.notifications')}</p>
 <p className="text-xs text-slate-500">{t('settings.notificationsDesc')}</p>
 </div>
 </div>
 <button
 onClick={() => setNotificationsEnabled(!notificationsEnabled)}
 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${notificationsEnabled ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-600'}`}
 >
 <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
 </button>
 </div>

 </div>
 </div>
      </div>

      {/* Company Profile Settings */}
      <div className="bg-white dark:bg-[#242424] rounded-lg shadow-sm border border-border-color dark:border-border-color overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-border-color/50 flex items-center gap-2">
          <Building className="text-primary" size={20} />
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Profil Perusahaan</h2>
        </div>
        <div className="p-6">
          {companySaveSuccess && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-300 text-sm flex items-center gap-2 animate-in fade-in slide-in-">
              <Check size={16} className="text-emerald-500 flex-shrink-0" />
              <span>Profil perusahaan berhasil disimpan.</span>
            </div>
          )}

          <form onSubmit={handleSaveCompany} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nama Perusahaan
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Masukkan nama perusahaan"
                disabled={!isAdmin}
                className="w-full text-sm bg-slate-50 dark:bg-[#1A1A1A]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Website
              </label>
              <input
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://example.com"
                disabled={!isAdmin}
                className="w-full text-sm bg-slate-50 dark:bg-[#1A1A1A]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Alamat
              </label>
              <textarea
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                rows={3}
                placeholder="Alamat lengkap perusahaan"
                disabled={!isAdmin}
                className="w-full text-sm bg-slate-50 dark:bg-[#1A1A1A]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Kontak (Email / Telepon)
              </label>
              <input
                type="text"
                value={companyContact}
                onChange={(e) => setCompanyContact(e.target.value)}
                placeholder="Email atau nomor telepon yang bisa dihubungi"
                disabled={!isAdmin}
                className="w-full text-sm bg-slate-50 dark:bg-[#1A1A1A]/50 border border-border-color dark:border-border-color rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-slate-800 dark:text-slate-200 disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>

            {isAdmin && (
              <div className="md:col-span-2 pt-2">
                <Button type="submit" icon={<Save size={16} />}>
                  Simpan Profil Perusahaan
                </Button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
