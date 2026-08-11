export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  dueDate?: string; // ISO date string
  completed: boolean;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
  subTasks: SubTask[];
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export interface AppSettings {
  language: 'id' | 'en';
  theme: 'light' | 'dark';
  defaultCategory: string;
  defaultPriority: 'high' | 'medium' | 'low';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

export interface DailyRecord {
  date: string;
  completed: number;
  created: number;
}

export interface UserProgress {
  totalPoints: number;
  level: number;
  badges: Badge[];
  streakDays: number;
  lastActiveDate: string;
  completedTasksHistory: DailyRecord[];
}
