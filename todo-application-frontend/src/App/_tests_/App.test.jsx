// src/App.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import { taskService } from '../../services/taskService.js';

// Mock the taskService
vi.mock('../../services/taskService.js', () => ({
  taskService: {
    getRecentTasks: vi.fn(),
    createTask: vi.fn(),
    completeTask: vi.fn(),
  },
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    taskService.getRecentTasks.mockReturnValue(new Promise(() => {}));
    render(<App />);
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('renders tasks from service', async () => {
    const tasks = [
      { id: 1, title: 'Task 1', completed: false },
      { id: 2, title: 'Task 2', completed: false },
    ];
    taskService.getRecentTasks.mockResolvedValue(tasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
    });
  });

  it('displays error if fetching fails', async () => {
    taskService.getRecentTasks.mockRejectedValue(new Error('Network Error'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    });
  });

  it('adds a new task correctly', async () => {
    const newTask = { id: 3, title: 'New Task', completed: false };
    taskService.getRecentTasks.mockResolvedValue([]);
    taskService.createTask.mockResolvedValue(newTask);

    render(<App />);
    const input = screen.getByPlaceholderText(/enter task title/i); // replace with actual placeholder
    const button = screen.getByRole('button', { name: /add task/i }); // replace with actual button text

    await userEvent.type(input, 'New Task');
    await userEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('New Task')).toBeInTheDocument();
    });
  });
});

