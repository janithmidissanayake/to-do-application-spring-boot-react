import api from './api';

// Task-related API functions
export const taskService = {
  createTask: async (taskData) => {
    try {
      const response = await api.post('/tasks/createTask', taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  getRecentTasks: async (limit = 5) => {
    try {
      const response = await api.get('/tasks/recentTasks', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch recent tasks:', error);
      throw error;
    }
  },

  completeTask: async (id) => {
    try {
      const response = await api.put(`/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  },
};
