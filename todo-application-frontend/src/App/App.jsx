import { useState, useEffect } from 'react'
import TaskForm from '../components/TaskForm/TaskForm.jsx'
import TaskList from '../components/TaskList/TaskList.jsx'
import { taskService } from '../services/taskService.js';

import '../App.css'

function App() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch recent tasks on component mount
  useEffect(() => {
    fetchRecentTasks();
  }, []);

  const fetchRecentTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await taskService.getRecentTasks(5);
      setTasks(fetchedTasks);
      setError(null);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      setLoading(true);
      const newTask = await taskService.createTask({
        title: taskData.title,
        description: taskData.description
      });
      setTasks([newTask, ...tasks]);
      setError(null);
      return { success: true };
    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task');
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (id) => {
    try {
      await taskService.completeTask(id);
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: true } : task
      ));
      setError(null);
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to complete task');
    }
  };

  const visibleTasks = tasks
    .filter(task => !task.completed)
    .slice(0, 5);

  

  return (
    
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 flex items-center justify-center p-4 md:p-8">
      <div className="max-w-7xl w-full mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-300 text-red-700 rounded-xl shadow-lg flex items-center gap-3">
            <svg className="w-6 h-6 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="font-medium">{error}</span>
          </div>
        )}
        
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          {/* Form Section */}
          <div className="flex-1 lg:w-[55%]">
            <div className="p-8 md:p-10">
              <TaskForm onAddTask={handleAddTask}  />
            </div>
          </div>
          
          {/* Tasks Section */}
          <div className="flex-1 lg:w-[45%]">
            <div className="bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 rounded-3xl shadow-2xl p-8 md:p-10 min-h-[600px] flex flex-col border-2 border-purple-700">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-3xl font-extrabold text-white mb-2 tracking-tight flex items-center gap-2">
                  <svg className="w-8 h-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                  </svg>
                  Your Tasks
                </h2>
                <p className="text-purple-100 text-sm">Manage your to-do list</p>
              </div>
              
              {loading && tasks.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <svg className="animate-spin h-12 w-12 text-white mx-auto mb-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-white text-lg font-semibold">Loading tasks...</p>
                  </div>
                </div>
              ) : (
                <TaskList
                  tasks={visibleTasks}
                  onToggle={handleToggleTask}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;