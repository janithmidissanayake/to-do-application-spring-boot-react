import { useState, useEffect } from 'react'
import TaskForm from './components/TaskForm.jsx'
import TaskList from './components/TaskList.jsx'
import { taskService } from './services/taskService.js';

import './App.css'

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
      // Send only title and description to match backend TaskRequest DTO
      const newTask = await taskService.createTask({
        title: taskData.title,
        description: taskData.description
      });
      // Add the new task to the beginning of the list
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
      // Update local state to mark task as completed
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: true } : task
      ));
      setError(null);
    } catch (err) {
      console.error('Error completing task:', err);
      setError('Failed to complete task');
    }
  };

  // Filter out completed tasks and show only the 5 most recent tasks
  const visibleTasks = tasks
    .filter(task => !task.completed)
    .slice(0, 5);

  

  return (
    
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-8 md:p-12">
      <div className="max-w-7xl w-full mx-auto">
        {/* Error Message */}
        {error && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="flex flex-col md:flex-row gap-8 lg:gap-10">
          {/* Form Section */}
          <div className="flex-1 md:w-[55%]">
            <div className="p-8 md:p-10">
              <TaskForm onAddTask={handleAddTask}  />
            </div>
          </div>
          
          {/* Tasks Section */}
          <div className="flex-1 md:w-[45%]">
            <div className="p-8 md:p-10 min-h-[600px] flex flex-col">
              {loading && tasks.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Loading tasks...</p>
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