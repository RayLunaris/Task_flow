import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  ShieldCheck, 
  Activity, 
  FolderPlus, 
  Layers
} from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { MemberCard } from '../components/team/MemberCard';
import { TeamFormModal } from '../components/team/TeamFormModal';
import { RoleMatrixModal } from '../components/team/RoleMatrixModal';
import { TeamStatsSummary } from '../components/team/TeamStatsSummary';
import { TeamWorkloadTab } from '../components/team/TeamWorkloadTab';
import { DepartmentCard } from '../components/team/DepartmentCard';
import { DepartmentDetailView } from '../components/team/DepartmentDetailView';
import { DepartmentFormModal } from '../components/team/DepartmentFormModal';
import { Button } from '../components/ui/Button';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_DEPARTMENTS } from '../utils/departmentData';
import type { Department, User, UserRole, UserStatus } from '../types';

export const TeamPage: React.FC = () => {
  const { users, user: currentUser } = useAuth();
  const { t } = useTranslation();

  const [departments, setDepartments] = useLocalStorage<Department[]>('taskflow_departments', DEFAULT_DEPARTMENTS);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const [activeTab, setActiveTab] = useState<'divisions' | 'members' | 'workload'>('divisions');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | UserStatus>('all');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isRoleMatrixOpen, setIsRoleMatrixOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<User | null>(null);
  const [deptToEdit, setDeptToEdit] = useState<Department | null>(null);
  const [inviteInitialDept, setInviteInitialDept] = useState<string | undefined>(undefined);

  const canAddMember = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  // Only team members (exclude unregistered / none status users unless currentUser)
  const teamMembers = useMemo(() => {
    return users.filter(u => u.id === currentUser?.id || (u.status && u.status !== 'none'));
  }, [users, currentUser]);

  // Unique department names from team members & defined departments
  const allDepartmentNames = useMemo(() => {
    const fromDepts = departments.map(d => d.name);
    const fromUsers = teamMembers.map(u => u.department || 'General');
    return Array.from(new Set([...fromDepts, ...fromUsers]));
  }, [departments, teamMembers]);

  // Filter members for the "Semua Anggota" directory tab
  const filteredUsers = useMemo(() => {
    return teamMembers.filter(u => {
      const matchesSearch = 
        u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.department?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || (u.status || 'active') === statusFilter;
      const matchesRole = roleFilter === 'all' || u.role === roleFilter;
      const matchesDept = departmentFilter === 'all' || (u.department || 'General') === departmentFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesDept;
    });
  }, [teamMembers, searchQuery, statusFilter, roleFilter, departmentFilter]);

  const handleEditMember = (member: User) => {
    setMemberToEdit(member);
    setInviteInitialDept(undefined);
    setIsModalOpen(true);
  };

  const handleAddNewMember = (initialDept?: string) => {
    setMemberToEdit(null);
    setInviteInitialDept(initialDept);
    setIsModalOpen(true);
  };

  const handleSaveDepartment = (newDept: Department) => {
    setDepartments(prev => {
      const exists = prev.findIndex(d => d.id === newDept.id);
      if (exists >= 0) {
        const copy = [...prev];
        copy[exists] = newDept;
        return copy;
      }
      return [...prev, newDept];
    });

    // If currently viewing this department, update selectedDepartment
    if (selectedDepartment && selectedDepartment.id === newDept.id) {
      setSelectedDepartment(newDept);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-16">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2.5">
            <Users className="text-primary" size={32} />
            {t('team.title', 'Struktur Tim & Divisi')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            {t('team.subtitle', 'Kelola anggota berdasarkan kelompok divisi/tim kerja, hak akses peran, dan alokasi kapasitas tugas.')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            onClick={() => setIsRoleMatrixOpen(true)}
            icon={<ShieldCheck size={18} className="text-primary" />}
            className="text-xs sm:text-sm"
          >
            Matrix Hak Akses
          </Button>

          {canAddMember && (
            <>
              <Button
                variant="secondary"
                onClick={() => { setDeptToEdit(null); setIsDeptModalOpen(true); }}
                icon={<FolderPlus size={18} className="text-primary" />}
                className="text-xs sm:text-sm"
              >
                + Buat Divisi Baru
              </Button>

              <Button onClick={() => handleAddNewMember()} icon={<UserPlus size={18} />} className="text-xs sm:text-sm shadow-md">
                {t('team.addMember', 'Undang / Tambah Anggota')}
              </Button>
            </>
          )}
        </div>
      </div>

      {/* KPI Stats Summary */}
      <TeamStatsSummary />

      {/* Main Tab Navigation */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pt-2 overflow-x-auto">
        <div className="flex items-center gap-6 sm:gap-8 min-w-max">
          <button
            onClick={() => { setActiveTab('divisions'); setSelectedDepartment(null); }}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'divisions'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers size={16} />
            Tim & Divisi Kerja ({departments.length})
          </button>

          <button
            onClick={() => { setActiveTab('members'); setSelectedDepartment(null); }}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'members'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Users size={16} />
            Semua Anggota ({teamMembers.length})
          </button>

          <button
            onClick={() => { setActiveTab('workload'); setSelectedDepartment(null); }}
            className={`pb-3 text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'workload'
                ? 'border-primary text-primary'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Activity size={16} />
            Distribusi Beban Kerja (Workload Balancing)
          </button>
        </div>
      </div>

      {/* Tab 1: Teams & Divisions (Overview or Selected Drilldown) */}
      {activeTab === 'divisions' && (
        selectedDepartment ? (
          /* Drill-down View: Detail Tim / Divisi yang Diklik */
          <DepartmentDetailView
            department={selectedDepartment}
            onBack={() => setSelectedDepartment(null)}
            onInviteToDepartment={(deptName) => handleAddNewMember(deptName)}
            onEditMember={handleEditMember}
            onOpenRoleMatrix={() => setIsRoleMatrixOpen(true)}
          />
        ) : (
          /* Grid of Division Cards */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
                  Daftar Divisi & Kelompok Tim
                </h3>
                <p className="text-xs text-slate-500">
                  Klik pada salah satu tim untuk melihat daftar anggota divisi, tugas aktif, dan ketua tim.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence>
                {departments.map((dept) => {
                  const deptMembers = teamMembers.filter(
                    u => (u.department || '').trim().toLowerCase() === dept.name.trim().toLowerCase()
                  );

                  return (
                    <DepartmentCard
                      key={dept.id}
                      department={dept}
                      members={deptMembers}
                      allUsers={users}
                      onSelect={(d) => setSelectedDepartment(d)}
                    />
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        )
      )}

      {/* Tab 2: All Members Directory */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          {/* Filters Bar */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search size={16} />
              </div>
              <input
                type="text"
                placeholder={t('team.searchPlaceholder', 'Cari berdasarkan nama, email, jabatan, departemen...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-9 pr-4 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-800 dark:text-slate-100 shadow-xs"
              />
            </div>

            {/* Dropdown Filters */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">Semua Status</option>
                <option value="active">Active (Resmi Bergabung)</option>
                <option value="invited">Invited (Menunggu Respon)</option>
                <option value="declined">Declined (Ditolak)</option>
                <option value="inactive">Inactive (Nonaktif)</option>
              </select>

              {/* Role Filter */}
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as any)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">Semua Peran</option>
                <option value="admin">Admin / Owner</option>
                <option value="manager">Project Manager</option>
                <option value="member">Team Member</option>
                <option value="client">Client / Viewer</option>
              </select>

              {/* Department Filter */}
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 text-slate-700 dark:text-slate-200 font-medium"
              >
                <option value="all">Semua Departemen</option>
                {allDepartmentNames.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Members Grid */}
          {teamMembers.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
              {t('team.noMembers', 'Belum ada anggota tim yang terdaftar.')}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
              {t('team.noMatch', 'Tidak ada anggota tim yang cocok dengan kriteria filter.')}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredUsers.map(member => (
                  <MemberCard key={member.id} member={member} onEdit={handleEditMember} />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Workload Balancing */}
      {activeTab === 'workload' && (
        <TeamWorkloadTab />
      )}

      {/* Modals */}
      <TeamFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        memberToEdit={memberToEdit}
        initialDepartment={inviteInitialDept}
      />

      <DepartmentFormModal
        isOpen={isDeptModalOpen}
        onClose={() => setIsDeptModalOpen(false)}
        onSave={handleSaveDepartment}
        users={users}
        departmentToEdit={deptToEdit}
      />

      <RoleMatrixModal
        isOpen={isRoleMatrixOpen}
        onClose={() => setIsRoleMatrixOpen(false)}
      />
    </div>
  );
};
