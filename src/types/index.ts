export type UserRole = 'admin' | 'manager' | 'member' | 'client';
export type UserStatus = 'active' | 'invited' | 'inactive' | 'declined' | 'none';

export interface User {
 id: string;
 name: string;
 email: string;
 password: string; // hashed simulasi
 role: UserRole;
 avatar?: string;
 department?: string;
 title?: string;
 phone?: string;
 status?: UserStatus;
 invitedBy?: string;
 inviteToken?: string;
 invitedAt?: string;
 resetToken?: string;
 resetTokenExpires?: string;
 createdAt: string;
}

export type PublicUser = Omit<User, 'password'>;

export interface ProjectUpdate {
 id: string;
 userId: string;
 percentage: number;
 description: string;
 createdAt: string;
}

export interface Project {
 id: string;
 name: string;
 description?: string;
 color: string;
 icon?: string;
 status: 'active' | 'on_hold' | 'completed' | 'archived';
 clientId?: string;
 memberIds: string[];
 managerId: string;
 progress: number;
 updates?: ProjectUpdate[]; // The commit history
 startDate?: string;
 dueDate?: string;
 createdAt: string;
 updatedAt: string;
}

export interface SubTask {
 id: string;
 title: string;
 completed: boolean;
}

export interface ChecklistItem {
 id: string;
 title: string;
 completed: boolean;
 order: number;
}

export interface ChecklistTemplate {
 id: string;
 name: string;
 items: Omit<ChecklistItem, 'completed'>[];
}

export interface Attachment {
 id: string;
 name: string;
 size: number;
 type: string;
 uploadedBy: string;
 uploadedAt: string;
}

export interface Comment {
 id: string;
 taskId: string;
 userId: string;
 content: string;
 mentions: string[];
 createdAt: string;
 updatedAt?: string;
 isEdited: boolean;
}

export interface TimeEntry {
 id: string;
 taskId: string;
 userId: string;
 startAt: string;
 endAt?: string;
 duration?: number;
}

export interface RecurringConfig {
 frequency: 'daily' | 'weekly' | 'monthly' | 'custom';
 interval: number;
 daysOfWeek?: number[];
 endDate?: string;
}

export interface Task {
 id: string;
 title: string;
 description?: string;
 priority: 'low' | 'medium' | 'high' | 'urgent';
 status: 'todo' | 'in_progress' | 'review' | 'done';
 projectId?: string;
 assigneeIds: string[];
 reporterId: string;
 reviewerId?: string;
 collaboratorIds?: string[];
 category: string;
 dueDate?: string;
 completed: boolean;
 completedAt?: string;
 subTasks: SubTask[];
 checklists: ChecklistItem[];
 attachments: Attachment[];
 comments: Comment[];
 timeEntries: TimeEntry[];
 isRecurring: boolean;
 recurringConfig?: RecurringConfig;
 reminderAt?: string;
 needsApproval: boolean;
 approvalStatus?: 'pending' | 'approved' | 'rejected';
 approvalNote?: string;
 revisionNote?: string;
 submittedForReviewAt?: string;
 reviewedAt?: string;
 milestoneId?: string;
 order: number;
 createdAt: string;
 updatedAt: string;
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

export interface Milestone {
 id: string;
 projectId: string;
 name: string;
 description?: string;
 targetDate: string;
 status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
 taskIds: string[];
  progress?: number;
 createdAt: string;
}

export interface Notification {
 id: string;
 userId: string;
 type: 'task_assigned' | 'deadline_near' | 'comment' | 'approval' | 'milestone' | 'team_invite';
 title: string;
 message: string;
 relatedId?: string;
 isRead: boolean;
 createdAt: string;
 inviteStatus?: 'pending' | 'accepted' | 'declined';
 inviteData?: {
 inviterId: string;
 inviterName: string;
 role: UserRole;
 department: string;
 title?: string;
 };
}

export interface Department {
 id: string;
 name: string;
 description?: string;
 icon?: string;
 color?: string;
 leadId?: string;
 memberIds?: string[];
 createdAt?: string;
}

export interface Client {
 id: string;
 name: string;
 company?: string;
 email?: string;
 phone?: string;
 projectIds: string[];
}

export interface ActivityLog {
 id: string;
 userId: string;
 action: string;
 targetType: 'task' | 'project' | 'user' | 'milestone';
 targetId: string;
 targetName: string;
 metadata?: Record<string, unknown>;
 createdAt: string;
}

export interface AuditLog {
 id: string;
 userId: string;
 action: string;
 ip?: string;
 createdAt: string;
}
