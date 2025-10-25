import React from 'react';
import TaskCard from './TaskCard.jsx';

const TaskList = ({ tasks, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="p-8 md:p-12 text-center flex-1 flex items-center justify-center">
        <p className="text-gray-400 text-base md:text-lg">No tasks yet. Add your first task to get started!</p>
      </div>
    );
  }

  return (
   <div className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1">
  {tasks.map(task => (
    <TaskCard
      key={task.id}
      task={task}
      onToggle={onToggle}
    />
  ))}
</div>

  );
};
export default TaskList;