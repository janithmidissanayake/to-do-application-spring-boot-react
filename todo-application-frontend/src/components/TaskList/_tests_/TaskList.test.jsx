// src/components/TaskList/_tests_/TaskList.test.jsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskList from '../TaskList.jsx';

describe('TaskList Component', () => {
  const mockOnToggle = vi.fn();

  it('renders empty message when tasks array is empty', () => {
    render(<TaskList tasks={[]} onToggle={mockOnToggle} />);
    expect(screen.getByText(/No tasks yet/i)).toBeInTheDocument();
  });

  it('renders correct number of tasks', () => {
    const tasks = [
      { id: 1, title: 'Groceries', description: '', completed: false },
      { id: 2, title: 'watching a tv series', description: '', completed: true },
    ];

    render(<TaskList tasks={tasks} onToggle={mockOnToggle} />);

    tasks.forEach(task => {
      expect(screen.getByText(task.title)).toBeInTheDocument();
    });

    const buttons = screen.getAllByRole('button', { name: /Done/i });
    expect(buttons.length).toBe(tasks.length);
  });

  it('calls onToggle when a task button is clicked', () => {
    const tasks = [
      { id: 1, title: 'Groceries', description: '', completed: false },
    ];

    render(<TaskList tasks={tasks} onToggle={mockOnToggle} />);

    const button = screen.getByRole('button', { name: /Done/i });
    fireEvent.click(button);

    expect(mockOnToggle).toHaveBeenCalledWith(tasks[0].id);
  });

  
});
