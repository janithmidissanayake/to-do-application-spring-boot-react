import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import TaskForm from '../TaskForm';

describe('TaskForm Component', () => {
  let mockOnAddTask;

  beforeEach(() => {
    mockOnAddTask = vi.fn();
  });

  it('renders all elements', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    expect(screen.getByRole('heading', { name: /Add New Task/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter task title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter task description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  it('inputs start empty', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    expect(screen.getByPlaceholderText(/Enter task title/i)).toHaveValue('');
    expect(screen.getByPlaceholderText(/Enter task description/i)).toHaveValue('');
  });

  it('button disabled initially', () => {
    render(<TaskForm onAddTask={mockOnAddTask} />);
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeDisabled();
  });

  it('updates title input', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const input = screen.getByPlaceholderText(/Enter task title/i);
    await user.type(input, 'My Task');
    expect(input).toHaveValue('My Task');
  });

  it('updates description input', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const textarea = screen.getByPlaceholderText(/Enter task description/i);
    await user.type(textarea, 'My description');
    expect(textarea).toHaveValue('My description');
  });

  it('enables button when title is not empty', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const input = screen.getByPlaceholderText(/Enter task title/i);
    const button = screen.getByRole('button', { name: /Add Task/i });
    await user.type(input, 'Task');
    expect(button).toBeEnabled();
  });

  it('button remains disabled with whitespace title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const input = screen.getByPlaceholderText(/Enter task title/i);
    const button = screen.getByRole('button', { name: /Add Task/i });
    await user.type(input, '   ');
    expect(button).toBeDisabled();
  });

  it('calls onAddTask with trimmed data on button click', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Enter task title/i);
    const descInput = screen.getByPlaceholderText(/Enter task description/i);
    const button = screen.getByRole('button', { name: /Add Task/i });

    await user.type(titleInput, '  My Task  ');
    await user.type(descInput, '  My Desc  ');

    mockOnAddTask.mockResolvedValue({ success: true });

    await user.click(button);

    expect(mockOnAddTask).toHaveBeenCalledTimes(1);
    expect(mockOnAddTask).toHaveBeenCalledWith({ title: 'My Task', description: 'My Desc' });
  });

  it('does not call onAddTask with empty title', async () => {
    const user = userEvent.setup();
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const button = screen.getByRole('button', { name: /Add Task/i });
    await user.click(button);
    expect(mockOnAddTask).not.toHaveBeenCalled();
  });

  it('clears form on successful submission', async () => {
    const user = userEvent.setup();
    mockOnAddTask.mockResolvedValue({ success: true });
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Enter task title/i);
    const descInput = screen.getByPlaceholderText(/Enter task description/i);
    const button = screen.getByRole('button', { name: /Add Task/i });

    await user.type(titleInput, 'Task');
    await user.type(descInput, 'Desc');
    await user.click(button);

    expect(titleInput).toHaveValue('');
    expect(descInput).toHaveValue('');
  });

  it('does not clear form on failed submission', async () => {
    const user = userEvent.setup();
    mockOnAddTask.mockResolvedValue({ success: false });
    render(<TaskForm onAddTask={mockOnAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Enter task title/i);
    const descInput = screen.getByPlaceholderText(/Enter task description/i);
    const button = screen.getByRole('button', { name: /Add Task/i });

    await user.type(titleInput, 'Task');
    await user.type(descInput, 'Desc');
    await user.click(button);

    expect(titleInput).toHaveValue('Task');
    expect(descInput).toHaveValue('Desc');
  });

  it('disables button during submission', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    const promise = new Promise((res) => { resolvePromise = res; });
    mockOnAddTask.mockReturnValue(promise);

    render(<TaskForm onAddTask={mockOnAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Enter task title/i);
    const button = screen.getByRole('button', { name: /Add Task/i });

    await user.type(titleInput, 'Task');
    await user.click(button);

    expect(button).toBeDisabled();
    resolvePromise({ success: true });
    await promise;
  });

  it('changes button text during submission', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    const promise = new Promise((res) => { resolvePromise = res; });
    mockOnAddTask.mockReturnValue(promise);

    render(<TaskForm onAddTask={mockOnAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Enter task title/i);
    const button = screen.getByRole('button', { name: /Add Task/i });

    await user.type(titleInput, 'Task');
    await user.click(button);

    expect(button).toHaveTextContent(/Adding Task/i);
    resolvePromise({ success: true });
    await promise;
  });


  it('prevents concurrent submissions', async () => {
    const user = userEvent.setup();
    let resolvePromise;
    const promise = new Promise((res) => { resolvePromise = res; });
    mockOnAddTask.mockReturnValue(promise);

    render(<TaskForm onAddTask={mockOnAddTask} />);
    const titleInput = screen.getByPlaceholderText(/Enter task title/i);
    const button = screen.getByRole('button', { name: /Add Task/i });

    await user.type(titleInput, 'Task');
    await user.click(button);
    await user.click(button);

    expect(mockOnAddTask).toHaveBeenCalledTimes(1);
    resolvePromise({ success: true });
    await promise;
  });

  
});
