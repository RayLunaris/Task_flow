import { useState } from 'react';
import { TaskProvider } from './context/TaskContext';
import { GamificationProvider } from './context/GamificationContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { TaskForm } from './components/tasks/TaskForm';
import { TaskList } from './components/tasks/TaskList';
import { TaskFilterBar } from './components/tasks/TaskFilterBar';
import { GamificationPanel } from './components/dashboard/GamificationPanel';
import { ProductivityChart } from './components/dashboard/ProductivityChart';
import { CalendarView } from './components/calendar/CalendarView';
import { useTranslation } from 'react-i18next';

function App() {
  const [currentView, setCurrentView] = useState<'tasks' | 'calendar' | 'dashboard'>('tasks');
  const { t } = useTranslation();

  return (
    <GamificationProvider>
      <TaskProvider>
        <div className="min-h-screen flex flex-col font-sans bg-slate-50/50 dark:bg-slate-950 pb-16 md:pb-0 transition-colors duration-300">
          <Navbar />
          
          <div className="flex flex-1 max-w-7xl mx-auto w-full">
            <Sidebar currentView={currentView} onChangeView={setCurrentView} />
            
            <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full min-h-[calc(100vh-4rem)]">
              {currentView === 'tasks' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 mb-2">{t('app.greeting')}</h1>
                    <p className="text-slate-500 dark:text-slate-400">{t('app.subtitle')}</p>
                  </div>
                  
                  <TaskForm />
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">{t('app.yourTasks')}</h2>
                    <TaskFilterBar />
                    <TaskList />
                  </div>
                </div>
              )}

              {currentView === 'calendar' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <CalendarView />
                </div>
              )}

              {currentView === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-8">
                  <GamificationPanel />
                  <ProductivityChart />
                </div>
              )}
            </main>
          </div>

          <BottomNav currentView={currentView} onChangeView={setCurrentView} />
        </div>
      </TaskProvider>
    </GamificationProvider>
  );
}

export default App;
