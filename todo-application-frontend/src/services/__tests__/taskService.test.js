import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { taskService } from '../taskService';
import api from '../api';

// Mock the api module
vi.mock('../api');

describe('taskService', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- I. createTask Tests ---
  describe('createTask', () => {
    it('should successfully create a task and return the response data', async () => {
      // Arrange
      const taskData = {
        title: 'New Task',
        description: 'Task description',
      };

      const mockResponse = {
        data: {
          id: 1,
          title: 'New Task',
          description: 'Task description',
          completed: false,
        },
      };

      api.post.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.createTask(taskData);

      // Assert
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith('/tasks/createTask', taskData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should log error and throw when API call fails', async () => {
      // Arrange
      const taskData = {
        title: 'New Task',
        description: 'Task description',
      };

      const mockError = new Error('Network error');
      api.post.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(taskService.createTask(taskData)).rejects.toThrow('Network error');
      
      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith('/tasks/createTask', taskData);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create task:', mockError);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('should handle empty task data', async () => {
      // Arrange
      const taskData = {};
      const mockResponse = {
        data: {
          id: 2,
          title: '',
          description: '',
          completed: false,
        },
      };

      api.post.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.createTask(taskData);

      // Assert
      expect(api.post).toHaveBeenCalledWith('/tasks/createTask', taskData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  // --- II. getRecentTasks Tests ---
  describe('getRecentTasks', () => {
    it('should fetch recent tasks with default limit of 5', async () => {
      // Arrange
      const mockResponse = {
        data: [
          { id: 1, title: 'Task 1', description: 'Description 1', completed: false },
          { id: 2, title: 'Task 2', description: 'Description 2', completed: true },
          { id: 3, title: 'Task 3', description: 'Description 3', completed: false },
        ],
      };

      api.get.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.getRecentTasks();

      // Assert
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith('/tasks/recentTasks', {
        params: { limit: 5 },
      });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch recent tasks with custom limit', async () => {
      // Arrange
      const customLimit = 10;
      const mockResponse = {
        data: Array.from({ length: 10 }, (_, i) => ({
          id: i + 1,
          title: `Task ${i + 1}`,
          description: `Description ${i + 1}`,
          completed: false,
        })),
      };

      api.get.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.getRecentTasks(customLimit);

      // Assert
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(api.get).toHaveBeenCalledWith('/tasks/recentTasks', {
        params: { limit: customLimit },
      });
      expect(result).toEqual(mockResponse.data);
      expect(result).toHaveLength(10);
    });

    it('should return empty array when no tasks exist', async () => {
      // Arrange
      const mockResponse = {
        data: [],
      };

      api.get.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.getRecentTasks();

      // Assert
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual([]);
    });

    it('should log error and throw when API call fails', async () => {
      // Arrange
      const mockError = new Error('Failed to fetch');
      api.get.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(taskService.getRecentTasks()).rejects.toThrow('Failed to fetch');
      
      expect(api.get).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch recent tasks:', mockError);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('should handle limit of 0', async () => {
      // Arrange
      const mockResponse = {
        data: [],
      };

      api.get.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.getRecentTasks(0);

      // Assert
      expect(api.get).toHaveBeenCalledWith('/tasks/recentTasks', {
        params: { limit: 0 },
      });
      expect(result).toEqual([]);
    });
  });

  // --- III. completeTask Tests ---
  describe('completeTask', () => {
    it('should successfully complete a task and return the response data', async () => {
      // Arrange
      const taskId = 1;
      const mockResponse = {
        data: {
          id: taskId,
          title: 'Completed Task',
          description: 'Task description',
          completed: true,
        },
      };

      api.put.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.completeTask(taskId);

      // Assert
      expect(api.put).toHaveBeenCalledTimes(1);
      expect(api.put).toHaveBeenCalledWith(`/tasks/${taskId}/complete`);
      expect(result).toEqual(mockResponse.data);
      expect(result.completed).toBe(true);
    });

    it('should handle completing a task with string ID', async () => {
      // Arrange
      const taskId = '123';
      const mockResponse = {
        data: {
          id: 123,
          title: 'Completed Task',
          description: 'Task description',
          completed: true,
        },
      };

      api.put.mockResolvedValue(mockResponse);

      // Act
      const result = await taskService.completeTask(taskId);

      // Assert
      expect(api.put).toHaveBeenCalledTimes(1);
      expect(api.put).toHaveBeenCalledWith(`/tasks/${taskId}/complete`);
      expect(result).toEqual(mockResponse.data);
    });

    it('should log error and throw when API call fails', async () => {
      // Arrange
      const taskId = 1;
      const mockError = new Error('Task not found');
      api.put.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(taskService.completeTask(taskId)).rejects.toThrow('Task not found');
      
      expect(api.put).toHaveBeenCalledTimes(1);
      expect(api.put).toHaveBeenCalledWith(`/tasks/${taskId}/complete`);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to complete task:', mockError);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('should handle network errors', async () => {
      // Arrange
      const taskId = 999;
      const mockError = {
        message: 'Network Error',
        response: {
          status: 500,
          data: { error: 'Internal Server Error' },
        },
      };

      api.put.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(taskService.completeTask(taskId)).rejects.toEqual(mockError);
      
      expect(api.put).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to complete task:', mockError);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });

    it('should handle 404 error for non-existent task', async () => {
      // Arrange
      const taskId = 999;
      const mockError = {
        message: 'Request failed with status code 404',
        response: {
          status: 404,
          data: { message: 'Task not found' },
        },
      };

      api.put.mockRejectedValue(mockError);

      // Spy on console.error
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Act & Assert
      await expect(taskService.completeTask(taskId)).rejects.toEqual(mockError);
      
      expect(api.put).toHaveBeenCalledTimes(1);
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to complete task:', mockError);

      // Restore console.error
      consoleErrorSpy.mockRestore();
    });
  });

  // --- IV. Integration-like Tests ---
  describe('Multiple API calls', () => {
    it('should handle multiple successful API calls in sequence', async () => {
      // Arrange
      const taskData = { title: 'New Task', description: 'Test' };
      const createResponse = {
        data: { id: 1, title: 'New Task', description: 'Test', completed: false },
      };
      const completeResponse = {
        data: { id: 1, title: 'New Task', description: 'Test', completed: true },
      };
      const getResponse = {
        data: [{ id: 1, title: 'New Task', description: 'Test', completed: true }],
      };

      api.post.mockResolvedValue(createResponse);
      api.put.mockResolvedValue(completeResponse);
      api.get.mockResolvedValue(getResponse);

      // Act
      const created = await taskService.createTask(taskData);
      const completed = await taskService.completeTask(created.id);
      const tasks = await taskService.getRecentTasks(1);

      // Assert
      expect(created.id).toBe(1);
      expect(completed.completed).toBe(true);
      expect(tasks).toHaveLength(1);
      expect(tasks[0].completed).toBe(true);
    });
  });
});

