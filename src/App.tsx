
import { TaskProvider } from './context/TaskContext';
import { Navbar } from './components/layout/Navbar';
import { TaskForm } from './components/tasks/TaskForm';
import { TaskList } from './components/tasks/TaskList';

function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col font-sans">
        <Navbar />
        
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Good morning, Rey! 👋</h1>
            <p className="text-slate-500">Here's a breakdown of your tasks for today.</p>
          </div>
          
          <TaskForm />
          
          <div className="mt-8">
            <h2 className="text-xl font-bold text-slate-700 mb-4">Your Tasks</h2>
            <TaskList />
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;
