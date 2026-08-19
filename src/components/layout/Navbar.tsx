import React, { useState } from 'react';
import { Command, Globe, Sun, Moon, LogOut, Bell, Check, Search, Settings, Building2, ChevronDown, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../hooks/useTheme';
import { useAuth } from '../../context/AuthContext';
import { useWorkspace } from '../../context/WorkspaceContext';
import { useTasks } from '../../hooks/useTasks';
import { useProjects } from '../../context/ProjectContext';
import { useMilestones } from '../../context/MilestoneContext';
import { useNotifications } from '../../context/NotificationContext';
import { exportTasksToExcel } from '../../utils/exportUtils';
import { useNavigate, useLocation } from 'react-router-dom';

export const Navbar: React.FC = () => {
 const { t, i18n } = useTranslation();
 const { theme, toggleTheme } = useTheme();
 const { user, users, logout } = useAuth();
 const { workspaces, activeWorkspace, switchWorkspace, createWorkspace } = useWorkspace();
 const { tasks } = useTasks();
 const { projects } = useProjects();
 const { milestones } = useMilestones();
 const { unreadCount } = useNotifications();
 const navigate = useNavigate();
 const location = useLocation();
 const [showProfileMenu, setShowProfileMenu] = useState(false);
 const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
 const [isExporting, setIsExporting] = useState(false);
 const [exported, setExported] = useState(false);

 const pathMap: Record<string, string> = {
 'dashboard': 'nav.dashboard',
 'my-tasks': 'nav.myTasks',
 'projects': 'nav.projects',
 'kanban': 'nav.kanban',
 'milestones': 'nav.milestones',
 'team': 'nav.team',
 'calendar': 'nav.calendar',
 'analytics': 'nav.analytics',
 'report': 'nav.report',
 'settings': 'nav.settings',
 'audit': 'nav.audit',
 'notifications': 'nav.notifications'
 };

 const currentPath = location.pathname.split('/')[1] || 'dashboard';
 const titleKey = pathMap[currentPath] || 'nav.dashboard';
 const pageTitle = t(titleKey);

 const toggleLanguage = () => {
 const newLang = i18n.language === 'id' ? 'en' : 'id';
 i18n.changeLanguage(newLang);
 };

 const handleExport = () => {
 setIsExporting(true);
 try {
 exportTasksToExcel({
 tasks,
 projects,
 users,
 milestones,
 language: i18n.language
 });
 setExported(true);
 setTimeout(() => {
 setExported(false);
 }, 2500);
 } catch (error) {
 console.error('Export error:', error);
 } finally {
 setIsExporting(false);
 }
 };

 const handleCreateWorkspace = () => {
   const name = window.prompt("Enter new workspace name:");
   if (name && name.trim()) {
     createWorkspace(name.trim());
     setShowWorkspaceMenu(false);
   }
 };

 return (
 <header className="bg-transparent sticky top-0 z-20 pt-6 px-6 transition-colors duration-300">
 <div className="w-full h-[52px] flex items-center justify-between">
 <div className="hidden md:flex items-center gap-4">
 <button className="text-lg font-bold font-heading text-[#1E293B] dark:text-[#F1F5F9] border-b-2 border-[#0D9488] pb-1 capitalize">
 {pageTitle}
 </button>

 {/* Workspace Switcher */}
 <div className="relative ml-4">
   <button 
     onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
     className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-[#242424] border border-[#E5E7EB] dark:border-[#333333] rounded-md shadow-sm hover:border-[#0D9488] transition-colors cursor-pointer"
   >
     <Building2 size={14} className="text-[#0D9488]" />
     <span className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7] max-w-[150px] truncate">
       {activeWorkspace?.name || 'Select Workspace'}
     </span>
     <ChevronDown size={14} className="text-[#64748B]" />
   </button>
   
   {showWorkspaceMenu && (
     <div className="absolute top-full left-0 mt-1 w-56 bg-white dark:bg-[#242424] border border-[#E5E7EB] dark:border-[#333333] rounded-md shadow-lg py-1 z-50">
       <div className="px-3 py-2 text-xs font-bold text-[#64748B] uppercase tracking-wider">
         Workspaces
       </div>
       {workspaces.map(w => (
         <button
           key={w.id}
           onClick={() => { switchWorkspace(w.id); setShowWorkspaceMenu(false); }}
           className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-[#FAFAF9] dark:hover:bg-[#1A1A1A] cursor-pointer ${activeWorkspace?.id === w.id ? 'text-[#0D9488] bg-[#0D9488]/5 font-semibold' : 'text-[#1E293B] dark:text-[#E4E4E7]'}`}
         >
           <span className="truncate">{w.name}</span>
           {activeWorkspace?.id === w.id && <Check size={14} />}
         </button>
       ))}
       <div className="border-t border-[#E5E7EB] dark:border-[#333333] mt-1 pt-1">
         <button
           onClick={handleCreateWorkspace}
           className="w-full text-left px-4 py-2 text-sm text-[#0D9488] hover:bg-[#0D9488]/10 flex items-center gap-2 font-medium cursor-pointer"
         >
           <Plus size={14} />
           Buat Perusahaan Baru
         </button>
       </div>
     </div>
   )}
 </div>
 
 <div className="hidden lg:flex items-center ml-4 bg-[#FFFFFF] dark:bg-[#242424] rounded-lg border border-[#E5E7EB] dark:border-[#333333] px-3 py-1.5 w-[250px] shadow-sm">
 <Search size={14} className="text-[#64748B] mr-2" />
 <input 
 type="text" 
 placeholder={t('navbar.searchPlaceholder')} 
 className="bg-transparent border-none outline-none text-xs w-full text-[#1E293B] dark:text-[#E4E4E7] placeholder:text-[#94A3B8]" 
 />
 </div>
 </div>
 
  {/* Mobile Logo / Page Title */}
  <div className="md:hidden flex flex-col gap-1">
    <div className="flex items-center gap-2">
      <Command size={20} className="text-[#0D9488]" strokeWidth={2.5} />
      <span className="font-bold text-[#1E293B] dark:text-[#F1F5F9] capitalize">{pageTitle}</span>
    </div>
    <div className="text-[10px] font-semibold text-[#64748B] flex items-center gap-1">
      <Building2 size={10} />
      <span className="truncate max-w-[120px]">{activeWorkspace?.name || 'Workspace'}</span>
    </div>
  </div>
 
 <div className="flex items-center gap-4 text-sm font-medium">
 
 {/* Theme Toggle */}
 <button 
 onClick={toggleTheme}
 className="flex items-center justify-center p-1.5 rounded-md text-[#64748B] hover:text-[#0D9488] hover:bg-[#0D9488]/10 transition-colors"
 title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
 >
 {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
 </button>

 {/* Language Toggle Button */}
 <button 
 onClick={toggleLanguage}
 className="flex items-center justify-center p-1.5 rounded-md text-[#64748B] hover:text-[#0D9488] hover:bg-[#0D9488]/10 transition-colors gap-1 font-bold"
 title={i18n.language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
 >
 <Globe size={16} />
 <span className="uppercase text-[11px]">{i18n.language === 'id' ? 'ID' : 'EN'}</span>
 </button>

 <div className="relative">
 <button 
 onClick={() => {
 navigate('/notifications');
 setShowProfileMenu(false);
 }}
 className="relative p-1.5 rounded-md text-[#64748B] hover:text-[#0D9488] hover:bg-[#0D9488]/10 transition-colors"
 title={t('navbar.notifications')}
 >
 <Bell size={18} />
 {unreadCount > 0 && (
 <span className="absolute 1 top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
 )}
 </button>
 </div>

 <div className="hidden sm:flex items-center gap-2 transition-colors">
 <button 
 onClick={handleExport}
 disabled={isExporting}
 className={`flex items-center gap-1.5 px-3 py-1.5 shadow-sm border rounded-md text-[11px] font-bold transition-all ${
 exported 
 ? 'border-green-500 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' 
 : 'bg-[#FFFFFF] dark:bg-[#242424] border-[#E5E7EB] dark:border-[#333333] text-[#1E293B] dark:text-[#E4E4E7] hover:border-[#0D9488] hover:text-[#0D9488] cursor-pointer active:scale-95'
 }`}
 title={t('navbar.exportData')}
 >
 {exported ? (
 <>
 <Check size={14} className="text-green-500 animate-in zoom-in" />
 <span>{t('navbar.exported')}</span>
 </>
 ) : (
 <>
 <span className="text-[#0D9488] font-bold">↓</span>
 <span>{isExporting ? t('navbar.exporting') : t('navbar.exportData')}</span>
 <span className="bg-[#0D9488] text-white px-1.5 py-0.5 rounded text-[9px] ml-1 font-extrabold uppercase">xls</span>
 </>
 )}
 </button>
 </div>

 {/* Hidden avatar on desktop because it's in sidebar, but we keep it here for mobile */}
 <div className="relative md:hidden">
 <button
 onClick={() => {
 setShowProfileMenu(!showProfileMenu);
 }}
 className="flex items-center justify-center rounded-full transition-transform active:scale-95 cursor-pointer"
 >
 {user?.avatar ? (
 <img src={user.avatar} alt={user?.name || 'User'} className="w-7 h-7 rounded-full object-cover ring-2 ring-[#0D9488]" />
 ) : (
 <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#0D9488] text-white font-bold text-xs">
 {user?.name.charAt(0).toUpperCase() || 'U'}
 </div>
 )}
 </button>

 {showProfileMenu && (
 <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] dark:bg-[#242424] rounded-lg shadow-sm border border-[#E5E7EB] dark:border-[#333333] py-1 animate-in fade-in slide-in- z-50">
 <div className="px-4 py-2 border-b border-[#E5E7EB] dark:border-[#333333]">
 <p className="text-sm font-semibold text-[#1E293B] dark:text-[#E4E4E7] truncate">{user?.name}</p>
 <p className="text-xs text-[#64748B] truncate">{user?.email}</p>
 <span className="inline-block mt-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-[#0D9488]/10 text-[#0D9488] border border-[#0D9488]/20">
 {user?.role}
 </span>
 </div>
 <button
 onClick={() => {
 navigate('/settings');
 setShowProfileMenu(false);
 }}
 className="w-full text-left px-4 py-2 text-sm text-[#1E293B] dark:text-[#E4E4E7] hover:bg-[#FAFAF9] dark:hover:bg-[#1A1A1A] flex items-center gap-2 cursor-pointer"
 >
 <Settings size={14} className="text-[#64748B]" />
 {t('nav.settings')}
 </button>
 <button
 onClick={() => {
 logout();
 setShowProfileMenu(false);
 }}
 className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-[#FAFAF9] dark:hover:bg-[#1A1A1A] flex items-center gap-2 cursor-pointer"
 >
 <LogOut size={14} />
 {t('navbar.logout')}
 </button>
 </div>
 )}
 </div>
 </div>
 </div>
 </header>
 );
};
