import { useState, useEffect } from 'react';
import { TaskProvider } from './context/TaskContext';
import { GamificationProvider } from './context/GamificationContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav } from './components/layout/BottomNav';
import { TaskForm } from './components/tasks/TaskForm';
import { TaskList } from './components/tasks/TaskList';
import { TaskFilterBar } from './components/tasks/TaskFilterBar';
import { GamificationPanel } from './components/dashboard/GamificationPanel';

function App() {
  const [currentView, setCurrentView] = useState<'tasks' | 'calendar' | 'dashboard'>('tasks');

  return (
    <GamificationProvider>
      <TaskProvider>
        <div className="min-h-screen flex flex-col font-sans bg-slate-50/50 pb-16 md:pb-0">
          <Navbar />
          
          <div className="flex flex-1 max-w-7xl mx-auto w-full">
            <Sidebar currentView={currentView} onChangeView={setCurrentView} />
            
            <main className="flex-1 px-4 py-8 max-w-4xl mx-auto w-full min-h-[calc(100vh-4rem)]">
              {currentView === 'tasks' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="mb-8 text-center sm:text-left">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Good morning, Rey! 👋</h1>
                    <p className="text-slate-500">Here's a breakdown of your tasks for today.</p>
                  </div>
                  
                  <TaskForm />
                  
                  <div className="mt-8">
                    <h2 className="text-xl font-bold text-slate-700 mb-4">Your Tasks</h2>
                    <TaskFilterBar />
                    <TaskList />
                  </div>
                </div>
              )}

              {currentView === 'calendar' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center justify-center h-full min-h-[50vh] text-slate-500">
                  <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h1 className="text-2xl font-bold text-slate-800 mb-2">Calendar View</h1>
                  <p className="text-center max-w-md">Fitur Phase 3 (Mode Kalender & Mingguan) sedang dalam tahap pengembangan.</p>
                </div>
              )}

              {currentView === 'dashboard' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <GamificationPanel />
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
