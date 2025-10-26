import api from './api';

// Task-related API functions
export const taskService = {
  createTask: async (taskData) => {
    try {
      const response = await api.post('/api/v1/tasks/createTask', taskData);
      return response.data;
    } catch (error) {
      console.error('Failed to create task:', error);
      throw error;
    }
  },

  getRecentTasks: async (limit = 5) => {
    try {
      const response = await api.get('/api/v1/tasks/recentTasks', {
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
      const response = await api.put(`/api/v1/tasks/${id}/complete`);
      return response.data;
    } catch (error) {
      console.error('Failed to complete task:', error);
      throw error;
    }
  },
};
