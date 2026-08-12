import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '../types';
import { hashPassword, verifyPassword } from '../utils/authUtils';

interface AuthContextType {
  user: User | null;
  users: User[];
  login: (email: string, pass: string) => boolean;
  logout: () => void;
  register: (name: string, email: string, pass: string, role?: 'admin' | 'manager' | 'member') => boolean;
  addUser: (name: string, email: string, pass: string, role: 'admin' | 'manager' | 'member') => boolean;
  updateUser: (id: string, updates: Partial<User>) => void;
  deleteUser: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Load users from localStorage
    const savedUsers = localStorage.getItem('taskflow_users');
    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    } else {
      // Create a default admin user if no users exist
      const defaultAdmin: User = {
        id: 'admin-1',
        name: 'Admin User',
        email: 'admin@taskflow.com',
        password: hashPassword('admin123'),
        role: 'admin',
        createdAt: new Date().toISOString(),
      };
      setUsers([defaultAdmin]);
      localStorage.setItem('taskflow_users', JSON.stringify([defaultAdmin]));
    }

    // Load active session
    const savedSession = localStorage.getItem('taskflow_session');
    if (savedSession) {
      setUser(JSON.parse(savedSession));
    }
  }, []);

  const login = (email: string, pass: string) => {
    const foundUser = users.find(u => u.email === email);
    if (foundUser && verifyPassword(pass, foundUser.password)) {
      setUser(foundUser);
      localStorage.setItem('taskflow_session', JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taskflow_session');
  };

  const register = (name: string, email: string, pass: string, role: 'admin' | 'manager' | 'member' = 'member') => {
    if (users.find(u => u.email === email)) {
      return false; // Email already exists
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashPassword(pass),
      role,
      createdAt: new Date().toISOString(),
    };
    
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
    
    // Auto login after register
    setUser(newUser);
    localStorage.setItem('taskflow_session', JSON.stringify(newUser));
    return true;
  };

  const addUser = (name: string, email: string, pass: string, role: 'admin' | 'manager' | 'member') => {
    if (users.find(u => u.email === email)) {
      return false; 
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      name,
      email,
      password: hashPassword(pass),
      role,
      createdAt: new Date().toISOString(),
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
    return true;
  };

  const updateUser = (id: string, updates: Partial<User>) => {
    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, ...updates } : u
    );
    // If updating password
    if (updates.password) {
      const uIndex = updatedUsers.findIndex(u => u.id === id);
      if (uIndex !== -1) {
        updatedUsers[uIndex].password = hashPassword(updates.password);
      }
    }
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
    
    // Update active session if updating self
    if (user && user.id === id) {
      const updatedSelf = updatedUsers.find(u => u.id === id)!;
      setUser(updatedSelf);
      localStorage.setItem('taskflow_session', JSON.stringify(updatedSelf));
    }
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(u => u.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('taskflow_users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, users, login, logout, register, addUser, updateUser, deleteUser }}>
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
