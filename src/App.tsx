import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WorkspaceProvider } from './context/WorkspaceContext';
import { TaskProvider } from './context/TaskContext';
import { GamificationProvider } from './context/GamificationContext';
import { ProjectProvider } from './context/ProjectContext';
import { MilestoneProvider } from './context/MilestoneContext';
import { NotificationProvider } from './context/NotificationContext';
import { ActivityProvider } from './context/ActivityContext';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { FindWorkspacePage } from './pages/FindWorkspacePage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { DashboardPage } from './pages/DashboardPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TeamPage } from './pages/TeamPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { MilestonePage } from './pages/MilestonePage';
import { KanbanPage } from './pages/KanbanPage';
import { NotificationPage } from './pages/NotificationPage';
import { AuditLogPage } from './pages/AuditLogPage';
import { SettingsPage } from './pages/SettingsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ReportPage } from './pages/ReportPage';
import './i18n';

function App() {
 return (
 <BrowserRouter>
 <AuthProvider>
 <WorkspaceProvider>
 <GamificationProvider>
 <ProjectProvider>
 <MilestoneProvider>
 <NotificationProvider>
 <ActivityProvider>
 <TaskProvider>
 <Routes>
 <Route path="/find-workspace" element={<FindWorkspacePage />} />
 <Route path="/login" element={<LoginPage />} />
 <Route path="/reset-password" element={<ResetPasswordPage />} />
 <Route path="/" element={<AppShell />}>
 <Route index element={<Navigate to="/dashboard" replace />} />
 <Route path="dashboard" element={<DashboardPage />} />
 <Route path="tasks" element={<Navigate to="/my-tasks" replace />} />
 <Route path="my-tasks" element={<MyTasksPage />} />
 <Route path="projects" element={<ProjectsPage />} />
 <Route path="kanban" element={<KanbanPage />} />
 <Route path="milestones" element={<MilestonePage />} />
 <Route path="team" element={<TeamPage />} />
 <Route path="calendar" element={<CalendarPage />} />
 <Route path="notifications" element={<NotificationPage />} />
 <Route path="audit" element={<AuditLogPage />} />
 <Route path="settings" element={<SettingsPage />} />
 <Route path="analytics" element={<AnalyticsPage />} />
 <Route path="report" element={<ReportPage />} />
 </Route>
 </Routes>
 </TaskProvider>
 </ActivityProvider>
 </NotificationProvider>
 </MilestoneProvider>
 </ProjectProvider>
 </GamificationProvider>
 </WorkspaceProvider>
 </AuthProvider>
 </BrowserRouter>
 );
}

export default App;
