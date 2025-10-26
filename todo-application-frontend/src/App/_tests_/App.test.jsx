// src/App.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App.jsx';
import { taskService } from '../../services/taskService.js';

// --- Mock the taskService ---
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
    taskService.getRecentTasks.mockReturnValue(new Promise(() => {})); // never resolves
    render(<App />);
    expect(screen.getByText(/loading tasks/i)).toBeInTheDocument();
  });

  it('renders tasks fetched from the service correctly', async () => {
    const tasks = [
      { id: 1, title: 'Attending to a party', completed: false },
      { id: 2, title: 'Buying a dress', completed: false },
    ];
    taskService.getRecentTasks.mockResolvedValue(tasks);

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Attending to a party')).toBeInTheDocument();
      expect(screen.getByText('Buying a dress')).toBeInTheDocument();
    });
  });

  it('displays an error message when fetching tasks fails', async () => {
    taskService.getRecentTasks.mockRejectedValue(new Error('Network Error'));

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    });
  });

  it('adds a new task successfully and displays it in the list', async () => {
    const newTask = { id: 3, title: 'Watching a movie', completed: false };
    taskService.getRecentTasks.mockResolvedValue([]); // initially empty
    taskService.createTask.mockResolvedValue(newTask);

    render(<App />);

    const input = screen.getByPlaceholderText(/enter task title/i);
    const button = screen.getByRole('button', { name: /add task/i });

    await userEvent.type(input, 'Watching a movie');
    await userEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText((text) => text.trim() === 'Watching a movie')
      ).toBeInTheDocument();
    });
  });
});
