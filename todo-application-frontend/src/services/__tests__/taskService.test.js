import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { taskService } from '../taskService';
import api from '../api';

// Mock the api module
vi.mock('../api');

describe('taskService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  // ---  createTask Tests ---
  describe('createTask', () => {
    it('should successfully create a task and return the response data', async () => {
      const taskData = { title: 'Buy Groceries', description: 'Purchase vegetables, fruits, and milk from the supermarket' };
      const mockResponse = { data: { id: 1, title: 'Buy Groceries', description: 'Purchase vegetables, fruits, and milk from the supermarket', completed: false } };

      api.post.mockResolvedValue(mockResponse);

      const result = await taskService.createTask(taskData);

      expect(api.post).toHaveBeenCalledTimes(1);
      expect(api.post).toHaveBeenCalledWith('/api/v1/tasks/createTask', taskData);
      expect(result).toEqual(mockResponse.data);
    });

    it('should log error and throw when API call fails', async () => {
      const taskData = { title: 'Buy Groceries', description: 'Purchase vegetables, fruits, and milk from the supermarket' };
      const mockError = new Error('Network error');
      api.post.mockRejectedValue(mockError);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(taskService.createTask(taskData)).rejects.toThrow('Network error');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to create task:', mockError);

      consoleErrorSpy.mockRestore();
    });

    it('should handle empty task data', async () => {
      const taskData = {};
      const mockResponse = { data: { id: 2, title: '', description: '', completed: false } };
      api.post.mockResolvedValue(mockResponse);

      const result = await taskService.createTask(taskData);

      expect(api.post).toHaveBeenCalledWith('/api/v1/tasks/createTask', taskData);
      expect(result).toEqual(mockResponse.data);
    });
  });

  // --- getRecentTasks Tests ---
  describe('getRecentTasks', () => {
    it('should fetch recent tasks with default limit of 5', async () => {
      const mockResponse = {
        data: [
          { id: 1, title: 'Buy Groceries', description: 'Vegetables, fruits, milk', completed: false },
          { id: 2, title: 'Morning Jog', description: 'Run 5 kilometers in the park', completed: true },
          { id: 3, title: 'Read Book', description: 'Read 50 pages of a technical book', completed: false },
        ],
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await taskService.getRecentTasks();

      expect(api.get).toHaveBeenCalledWith('/api/v1/tasks/recentTasks', { params: { limit: 5 } });
      expect(result).toEqual(mockResponse.data);
    });

    it('should fetch recent tasks with custom limit', async () => {
      const customLimit = 3;
      const mockResponse = {
        data: [
          { id: 1, title: 'Buy Groceries', description: 'Vegetables, fruits, milk', completed: false },
          { id: 2, title: 'Morning Jog', description: 'Run 5 kilometers in the park', completed: true },
          { id: 3, title: 'Read Book', description: 'Read 50 pages of a technical book', completed: false },
        ],
      };
      api.get.mockResolvedValue(mockResponse);

      const result = await taskService.getRecentTasks(customLimit);

      expect(api.get).toHaveBeenCalledWith('/api/v1/tasks/recentTasks', { params: { limit: customLimit } });
      expect(result).toEqual(mockResponse.data);
      expect(result).toHaveLength(3);
    });

    it('should return empty array when no tasks exist', async () => {
      api.get.mockResolvedValue({ data: [] });

      const result = await taskService.getRecentTasks();

      expect(result).toEqual([]);
    });

    it('should log error and throw when API call fails', async () => {
      const mockError = new Error('Failed to fetch');
      api.get.mockRejectedValue(mockError);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(taskService.getRecentTasks()).rejects.toThrow('Failed to fetch');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to fetch recent tasks:', mockError);

      consoleErrorSpy.mockRestore();
    });
  });

  // ---  completeTask Tests ---
  describe('completeTask', () => {
    it('should complete a task and return updated data', async () => {
      const taskId = 1;
      const mockResponse = { data: { id: taskId, title: 'Buy Groceries', description: 'Vegetables, fruits, milk', completed: true } };
      api.put.mockResolvedValue(mockResponse);

      const result = await taskService.completeTask(taskId);

      expect(api.put).toHaveBeenCalledWith(`/api/v1/tasks/${taskId}/complete`);
      expect(result.completed).toBe(true);
    });

    it('should log error and throw when API call fails', async () => {
      const taskId = 1;
      const mockError = new Error('Task not found');
      api.put.mockRejectedValue(mockError);

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(taskService.completeTask(taskId)).rejects.toThrow('Task not found');
      expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to complete task:', mockError);

      consoleErrorSpy.mockRestore();
    });
  });

  // --- Integration-like Tests ---
  describe('Multiple API calls', () => {
    it('should create, complete, and fetch tasks sequentially', async () => {
      const taskData = { title: 'Prepare Presentation', description: 'Prepare slides for the Monday team meeting' };
      const createResponse = { data: { id: 1, title: 'Prepare Presentation', description: 'Prepare slides for the Monday team meeting', completed: false } };
      const completeResponse = { data: { id: 1, title: 'Prepare Presentation', description: 'Prepare slides for the Monday team meeting', completed: true } };
      const getResponse = { data: [{ id: 1, title: 'Prepare Presentation', description: 'Prepare slides for the Monday team meeting', completed: true }] };

      api.post.mockResolvedValue(createResponse);
      api.put.mockResolvedValue(completeResponse);
      api.get.mockResolvedValue(getResponse);

      const created = await taskService.createTask(taskData);
      const completedTask = await taskService.completeTask(created.id);
      const tasks = await taskService.getRecentTasks(1);

      expect(created.id).toBe(1);
      expect(completedTask.completed).toBe(true);
      expect(tasks).toHaveLength(1);
    });
  });
});
