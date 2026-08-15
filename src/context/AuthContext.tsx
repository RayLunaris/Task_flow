import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, PublicUser, UserRole, UserStatus } from '../types';
import { hashPassword, verifyPassword } from '../utils/authUtils';

interface AuthContextType {
 user: PublicUser | null;
 users: PublicUser[];
 login: (email: string, pass: string) => boolean;
 logout: () => void;
 register: (name: string, email: string, pass: string, role?: UserRole) => boolean;
 addUser: (
 name: string, 
 email: string, 
 pass: string, 
 role: UserRole, 
 department?: string, 
 title?: string, 
 status?: UserStatus,
 phone?: string
 ) => boolean;
 inviteUser: (
 email: string, 
 role: UserRole, 
 department: string, 
 name?: string, 
 title?: string
 ) => { success: boolean; inviteLink: string; user?: User; error?: string };
 inviteExistingUser: (
 targetUserId: string, 
 role: UserRole, 
 department: string, 
 title?: string
 ) => { success: boolean; inviteLink: string; error?: string };
 acceptTeamInvite: (userId: string) => void;
 declineTeamInvite: (userId: string) => void;
 removeFromTeam: (userId: string) => void;
 resendInvite: (id: string) => { success: boolean; inviteLink: string };
 toggleUserStatus: (id: string) => void;
 updateUser: (id: string, updates: Partial<User>) => void;
 deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


const sanitizeUser = (user: User): PublicUser => {
  const { password, ...publicFields } = user;
  return publicFields;
};

const SEED_USERS: User[] = [
 {
 id: 'admin-1',
 name: 'Sarah Connor',
 email: 'admin@taskflow.com',
 password: hashPassword('admin123'),
 role: 'admin',
 department: 'Management',
 title: 'Workspace Owner / Director',
 status: 'active',
 avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
 createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
 },
 {
 id: 'manager-1',
 name: 'David Miller',
 email: 'david.miller@taskflow.com',
 password: hashPassword('password123'),
 role: 'manager',
 department: 'Product',
 title: 'Lead Technical Project Manager',
 status: 'active',
 avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
 createdAt: new Date(Date.now() - 25 * 86400000).toISOString(),
 },
 {
 id: 'member-1',
 name: 'Alex Rivera',
 email: 'alex.rivera@taskflow.com',
 password: hashPassword('password123'),
 role: 'member',
 department: 'Engineering',
 title: 'Senior Frontend Developer',
 status: 'invited', // Demo pending invitation for Alex Rivera!
 invitedBy: 'admin-1',
 avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
 createdAt: new Date(Date.now() - 20 * 86400000).toISOString(),
 },
 {
 id: 'member-2',
 name: 'Elena Rostova',
 email: 'elena.rostova@taskflow.com',
 password: hashPassword('password123'),
 role: 'member',
 department: 'Design & UI/UX',
 title: 'Senior UI/UX Product Designer',
 status: 'active',
 avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
 createdAt: new Date(Date.now() - 18 * 86400000).toISOString(),
 },
 {
 id: 'member-3',
 name: 'Marcus Chen',
 email: 'marcus.chen@taskflow.com',
 password: hashPassword('password123'),
 role: 'member',
 department: 'Marketing',
 title: 'Growth Marketing Specialist',
 status: 'none', // Standalone registered user, not yet in team
 avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
 createdAt: new Date(Date.now() - 14 * 86400000).toISOString(),
 },
 {
 id: 'client-1',
 name: 'Jessica Pearson',
 email: 'jessica@acmecorp.com',
 password: hashPassword('password123'),
 role: 'client',
 department: 'Client Partner',
 title: 'Enterprise Client Representative',
 status: 'none', // Standalone user
 avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
 createdAt: new Date(Date.now() - 10 * 86400000).toISOString(),
 }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
 const [internalUsers, setInternalUsers] = useState<User[]>([]);
 const [user, setUser] = useState<PublicUser | null>(null);
 const publicUsers = React.useMemo(() => internalUsers.map(sanitizeUser), [internalUsers]);

 useEffect(() => {
 // Load users from localStorage
 const savedUsers = localStorage.getItem('taskflow_users');
 if (savedUsers) {
 const parsedUsers: User[] = JSON.parse(savedUsers);
 const migrated = parsedUsers.map(u => ({
 ...u,
 status: u.status !== undefined ? u.status : 'active',
 department: u.department || 'General',
 title: u.title || (u.role === 'admin' ? 'Workspace Admin' : u.role === 'manager' ? 'Project Manager' : u.role === 'client' ? 'Client Viewer' : 'Team Member')
 }));
 setInternalUsers(migrated);
 } else {
 setInternalUsers(SEED_USERS);
 localStorage.setItem('taskflow_users', JSON.stringify(SEED_USERS));
 }

 // Load active session
 const savedSession = localStorage.getItem('taskflow_session');
 if (savedSession) {
 const parsedSession: PublicUser = JSON.parse(savedSession);
 setUser(parsedSession);
 } else {
 const defaultUser = SEED_USERS[0];
 setUser(sanitizeUser(defaultUser));
 localStorage.setItem('taskflow_session', JSON.stringify(sanitizeUser(defaultUser)));
 }
 }, []);

 const login = (email: string, pass: string) => {
 const foundUser = internalUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
 if (foundUser && verifyPassword(pass, foundUser.password)) {
 if (foundUser.status === 'inactive') {
 alert('This account is currently deactivated. Please contact your workspace administrator.');
 return false;
 }

 setUser(sanitizeUser(foundUser));
 localStorage.setItem('taskflow_session', JSON.stringify(sanitizeUser(foundUser)));
 return true;
 }
 return false;
 };

 const logout = () => {
 setUser(null);
 localStorage.removeItem('taskflow_session');
 };

 const register = (name: string, email: string, pass: string, role: UserRole = 'member') => {
 if (internalUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
 return false; // Email already exists
 }
 
 const newUser: User = {
 id: crypto.randomUUID(),
 name,
 email,
 password: hashPassword(pass),
 role,
 department: 'General',
 title: role === 'admin' ? 'Workspace Admin' : role === 'manager' ? 'Project Manager' : role === 'client' ? 'Client Viewer' : 'Team Member',
 status: 'active',
 createdAt: new Date().toISOString(),
 };
 
 const updatedUsers = [...internalUsers, newUser];
 setInternalUsers(updatedUsers);
 localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
 
 setUser(sanitizeUser(newUser));
 localStorage.setItem('taskflow_session', JSON.stringify(sanitizeUser(newUser)));
 return true;
 };

 const addUser = (
 name: string, 
 email: string, 
 pass: string, 
 role: UserRole, 
 department: string = 'General', 
 title?: string, 
 status: UserStatus = 'active',
 phone?: string
 ) => {
 if (internalUsers.find(u => u.email.toLowerCase() === email.toLowerCase())) {
 return false; 
 }
 const newUser: User = {
 id: crypto.randomUUID(),
 name,
 email,
 password: hashPassword(pass),
 role,
 department,
 title: title || (role === 'admin' ? 'Workspace Admin' : role === 'manager' ? 'Project Manager' : role === 'client' ? 'Client Viewer' : 'Team Member'),
 status,
 phone,
 createdAt: new Date().toISOString(),
 };
 const updatedUsers = [...internalUsers, newUser];
 setInternalUsers(updatedUsers);
 localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
 return true;
 };

 const inviteExistingUser = (
 targetUserId: string, 
 role: UserRole, 
 department: string = 'General', 
 title?: string
 ) => {
 const target = internalUsers.find(u => u.id === targetUserId);
 if (!target) return { success: false, inviteLink: '', error: 'Pengguna tidak ditemukan.' };

 const token = 'inv_' + crypto.randomUUID().slice(0, 10);
 const updatedUsers = internalUsers.map(u => 
 u.id === targetUserId 
 ? { 
 ...u, 
 role, 
 department, 
 title: title || u.title || (role === 'admin' ? 'Workspace Admin' : role === 'manager' ? 'Project Manager' : role === 'client' ? 'Client Viewer' : 'Team Member'),
 status: 'invited' as UserStatus,
 invitedBy: user?.id || 'admin-1',
 inviteToken: token,
 invitedAt: new Date().toISOString()
 } 
 : u
 );

 setInternalUsers(updatedUsers);
 localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));

 // Send in-app notification to target user
 try {
 const storedNotifs = localStorage.getItem('taskflow_notifications');
 const allNotifs = storedNotifs ? JSON.parse(storedNotifs) : [];
 const newNotif = {
 id: crypto.randomUUID(),
 userId: targetUserId,
 type: 'team_invite',
 title: 'Undangan Bergabung ke Tim TaskFlow',
 message: `${user?.name || 'Admin'} mengundang Anda untuk bergabung ke tim sebagai ${title || role} (${department}).`,
 isRead: false,
 inviteStatus: 'pending',
 inviteData: {
 inviterId: user?.id || 'admin-1',
 inviterName: user?.name || 'Admin',
 role,
 department,
 title: title || (role === 'admin' ? 'Workspace Admin' : role === 'manager' ? 'Project Manager' : role === 'client' ? 'Client Viewer' : 'Team Member')
 },
 createdAt: new Date().toISOString(),
 };
 localStorage.setItem('taskflow_notifications', JSON.stringify([newNotif, ...allNotifs]));
 } catch (e) {
 console.error('Failed to create notification', e);
 }

 const origin = typeof window !== 'undefined' ? window.location.origin : 'https://taskflow.app';
 const inviteLink = `${origin}/notifications`;

 return { success: true, inviteLink };
 };

 const inviteUser = (
 email: string, 
 role: UserRole, 
 department: string = 'General', 
 name?: string, 
 title?: string
 ) => {
 const existing = internalUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
 if (existing) {
 return inviteExistingUser(existing.id, role, department, title);
 }

 const inviteToken = 'inv_' + crypto.randomUUID().slice(0, 10);
 const inferredName = name?.trim() || email.split('@')[0].replace(/[\._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
 
 const newUser: User = {
 id: crypto.randomUUID(),
 name: inferredName,
 email: email.trim().toLowerCase(),
 password: hashPassword('TaskFlow@2026'),
 role,
 department,
 title: title || (role === 'admin' ? 'Workspace Admin' : role === 'manager' ? 'Project Manager' : role === 'client' ? 'Client Viewer' : 'Team Member'),
 status: 'invited',
 invitedBy: user?.id || 'admin-1',
 inviteToken,
 invitedAt: new Date().toISOString(),
 createdAt: new Date().toISOString(),
 };

 const updatedUsers = [...internalUsers, newUser];
 setInternalUsers(updatedUsers);
 localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));

 // Send in-app notification to new user
 try {
 const storedNotifs = localStorage.getItem('taskflow_notifications');
 const allNotifs = storedNotifs ? JSON.parse(storedNotifs) : [];
 const newNotif = {
 id: crypto.randomUUID(),
 userId: newUser.id,
 type: 'team_invite',
 title: 'Undangan Bergabung ke Tim TaskFlow',
 message: `${user?.name || 'Admin'} mengundang Anda untuk bergabung ke tim sebagai ${title || role} (${department}).`,
 isRead: false,
 inviteStatus: 'pending',
 inviteData: {
 inviterId: user?.id || 'admin-1',
 inviterName: user?.name || 'Admin',
 role,
 department,
 title: title || (role === 'admin' ? 'Workspace Admin' : role === 'manager' ? 'Project Manager' : role === 'client' ? 'Client Viewer' : 'Team Member')
 },
 createdAt: new Date().toISOString(),
 };
 localStorage.setItem('taskflow_notifications', JSON.stringify([newNotif, ...allNotifs]));
 } catch (e) {
 console.error('Failed to create notification', e);
 }

 const origin = typeof window !== 'undefined' ? window.location.origin : 'https://taskflow.app';
 const inviteLink = `${origin}/login?invite=${inviteToken}&email=${encodeURIComponent(email)}`;

 return { success: true, inviteLink, user: newUser };
 };

 const acceptTeamInvite = (userId: string) => {
 updateUser(userId, { status: 'active' });
 };

 const declineTeamInvite = (userId: string) => {
 updateUser(userId, { status: 'declined' });
 };

 const removeFromTeam = (userId: string) => {
 updateUser(userId, { status: 'none' });
 };

 const resendInvite = (id: string) => {
 const target = internalUsers.find(u => u.id === id);
 if (!target) return { success: false, inviteLink: '' };

 const token = target.inviteToken || 'inv_' + crypto.randomUUID().slice(0, 10);
 const updatedUsers = internalUsers.map(u => 
 u.id === id 
 ? { ...u, inviteToken: token, invitedAt: new Date().toISOString(), status: 'invited' as UserStatus } 
 : u
 );
 setInternalUsers(updatedUsers);
 localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));

 // Re-send notification
 try {
 const storedNotifs = localStorage.getItem('taskflow_notifications');
 const allNotifs = storedNotifs ? JSON.parse(storedNotifs) : [];
 const newNotif = {
 id: crypto.randomUUID(),
 userId: id,
 type: 'team_invite',
 title: 'Undangan Bergabung ke Tim (Kirim Ulang)',
 message: `${user?.name || 'Admin'} mengirim ulang undangan bergabung ke tim untuk Anda.`,
 isRead: false,
 inviteStatus: 'pending',
 inviteData: {
 inviterId: user?.id || 'admin-1',
 inviterName: user?.name || 'Admin',
 role: target.role,
 department: target.department || 'General',
 title: target.title
 },
 createdAt: new Date().toISOString(),
 };
 localStorage.setItem('taskflow_notifications', JSON.stringify([newNotif, ...allNotifs]));
 } catch (e) {
 console.error(e);
 }

 const origin = typeof window !== 'undefined' ? window.location.origin : 'https://taskflow.app';
 const inviteLink = `${origin}/login?invite=${token}&email=${encodeURIComponent(target.email)}`;

 return { success: true, inviteLink };
 };

 const toggleUserStatus = (id: string) => {
 const target = internalUsers.find(u => u.id === id);
 if (!target) return;

 const nextStatus: UserStatus = target.status === 'active' ? 'inactive' : 'active';
 updateUser(id, { status: nextStatus });
 };

 const updateUser = (id: string, updates: Partial<User>) => {
 const updatedUsers = internalUsers.map(u => 
 u.id === id ? { ...u, ...updates } : u
 );
 if (updates.password) {
 const uIndex = updatedUsers.findIndex(u => u.id === id);
 if (uIndex !== -1) {
 updatedUsers[uIndex].password = hashPassword(updates.password);
 }
 }
 setInternalUsers(updatedUsers);
 localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
 
 if (user && user.id === id) {
 const updatedSelf = updatedUsers.find(u => u.id === id)!;
 setUser(sanitizeUser(updatedSelf));
 localStorage.setItem('taskflow_session', JSON.stringify(sanitizeUser(updatedSelf)));
 }
 };

 const deleteUser = (id: string) => {
 const updatedUsers = internalUsers.filter(u => u.id !== id);
 setInternalUsers(updatedUsers);
 localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
 };

 return (
 <AuthContext.Provider value={{ 
 user, 
 users: publicUsers, 
 login, 
 logout, 
 register, 
 addUser, 
 inviteUser, 
 inviteExistingUser,
 acceptTeamInvite,
 declineTeamInvite,
 removeFromTeam,
 resendInvite, 
 toggleUserStatus, 
 updateUser, 
 deleteUser 
 }}>
 {children}
 </AuthContext.Provider>
 );
};

export const useAuth = () => {
 const context = useContext(AuthContext);
 if (context === undefined) {
 throw new Error('useAuth must be used within an AuthProvider');
 }
 return context;
};
