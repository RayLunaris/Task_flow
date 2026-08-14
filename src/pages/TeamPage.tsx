import React, { useState } from 'react';
import { Users, UserPlus, Search } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { MemberCard } from '../components/team/MemberCard';
import { TeamFormModal } from '../components/team/TeamFormModal';
import { Button } from '../components/ui/Button';
import type { User } from '../types';

export const TeamPage: React.FC = () => {
  const { users, user: currentUser } = useAuth();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memberToEdit, setMemberToEdit] = useState<User | null>(null);

  const canAddMember = currentUser?.role === 'admin' || currentUser?.role === 'manager';

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.role?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (member: User) => {
    setMemberToEdit(member);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setMemberToEdit(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <Users className="text-primary" />
            {t('team.title')}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">{t('team.subtitle')}</p>
        </div>
        {canAddMember && (
          <Button onClick={handleAddNew} icon={<UserPlus size={20} />}>
            {t('team.addMember')}
          </Button>
        )}
      </div>

      <div className="relative max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-slate-400" />
        </div>
        <input
          type="text"
          placeholder={t('team.searchPlaceholder')}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary text-sm text-slate-800 dark:text-slate-200"
        />
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12 text-slate-500">{t('team.noMembers')}</div>
      ) : filteredUsers.length === 0 ? (
        <div className="text-center py-12 text-slate-500">{t('team.noMatch')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredUsers.map(member => (
              <MemberCard key={member.id} member={member} onEdit={handleEdit} />
            ))}
          </AnimatePresence>
        </div>
      )}

      <TeamFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        memberToEdit={memberToEdit} 
      />
    </div>
  );
};
