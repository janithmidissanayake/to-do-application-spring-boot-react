import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom'; // brings matchers like toBeInTheDocument

import TaskCard from '../TaskCard';

// --- Setup Test Data ---
const incompleteTask = {
  id: 1,
  title: 'Buy Groceries',
  description: 'Milk, bread, and eggs.',
  completed: false,
};

const completedTask = {
  id: 2,
  title: 'Finish Report',
  description: 'Final review and submission to manager.',
  completed: true,
};

const taskWithoutDescription = {
  id: 3,
  title: 'Take out the trash',
  description: null,
  completed: false,
};

describe('TaskCard Component', () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();

  // Reset mocks before each test
  beforeEach(() => {
    mockOnToggle.mockReset();
    mockOnDelete.mockReset();
  });

  // --- I. Rendering and Basic Content Tests ---
  it('renders the title and button for an incomplete task', () => {
    render(<TaskCard task={incompleteTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    // Flexible heading query (any level)
    expect(screen.getByRole('heading', { name: incompleteTask.title })).toBeInTheDocument();

    // Button check (matches Done button)
    expect(screen.getByRole('button', { name: /Done/i })).toBeInTheDocument();
  });

  it('renders the description when provided', () => {
    render(<TaskCard task={incompleteTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
    expect(screen.getByText(incompleteTask.description)).toBeInTheDocument();
  });

  it('does NOT render a description if it is null', () => {
  render(<TaskCard task={taskWithoutDescription} onToggle={mockOnToggle} onDelete={mockOnDelete} />);
  
  const descriptionElement = screen.queryByTestId(`description-${taskWithoutDescription.id}`);
  expect(descriptionElement).not.toBeInTheDocument();
});


  // --- II. Conditional Styling Tests ---
  it('applies "line-through" class for a completed task', () => {
    render(<TaskCard task={completedTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const titleElement = screen.getByRole('heading', { name: completedTask.title });
    const descriptionElement = screen.getByText(completedTask.description);

    expect(titleElement).toHaveClass('line-through');
    expect(descriptionElement).toHaveClass('line-through');
  });

  it('does NOT apply "line-through" class for an incomplete task', () => {
    render(<TaskCard task={incompleteTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const titleElement = screen.getByRole('heading', { name: incompleteTask.title });
    expect(titleElement).not.toHaveClass('line-through');
  });

  // --- III. User Interaction Tests ---
  it('calls onToggle with the correct task ID when Done button is clicked', async () => {
    const user = userEvent.setup();
    render(<TaskCard task={incompleteTask} onToggle={mockOnToggle} onDelete={mockOnDelete} />);

    const doneButton = screen.getByRole('button', { name: /Done/i });
    await user.click(doneButton);

    expect(mockOnToggle).toHaveBeenCalledTimes(1);
    expect(mockOnToggle).toHaveBeenCalledWith(incompleteTask.id);
  });

  
});
