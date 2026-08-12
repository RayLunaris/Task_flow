import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { GamificationProvider } from './context/GamificationContext';
import { ProjectProvider } from './context/ProjectContext';
import { MilestoneProvider } from './context/MilestoneContext';
import { NotificationProvider } from './context/NotificationContext';
import { AppShell } from './components/layout/AppShell';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { TasksPage } from './pages/TasksPage';
import { CalendarPage } from './pages/CalendarPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { TeamPage } from './pages/TeamPage';
import { MyTasksPage } from './pages/MyTasksPage';
import { MilestonePage } from './pages/MilestonePage';
import { KanbanPage } from './pages/KanbanPage';
import { NotificationPage } from './pages/NotificationPage';
import './i18n';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GamificationProvider>
        <ProjectProvider>
        <MilestoneProvider>
        <NotificationProvider>
        <TaskProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<AppShell />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="my-tasks" element={<MyTasksPage />} />
              <Route path="projects" element={<ProjectsPage />} />
              <Route path="kanban" element={<KanbanPage />} />
              <Route path="milestones" element={<MilestonePage />} />
              <Route path="team" element={<TeamPage />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="tasks" element={<TasksPage />} />
              <Route path="notifications" element={<NotificationPage />} />
            </Route>
          </Routes>
        </TaskProvider>
        </NotificationProvider>
        </MilestoneProvider>
        </ProjectProvider>
        </GamificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
