import React from 'react';

const TaskCard = ({ task, onToggle }) => {
  return (
    <div
      className={`bg-gray-300 rounded-lg min-h-[100px] transition duration-200 hover:bg-gray-350 p-6 ${
        task.completed ? 'opacity-70' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Text container */}
        <div className="flex-1 min-w-0">
          <h3 className={`text-base font-bold text-gray-900 mb-1 break-words ${
            task.completed ? 'line-through text-gray-600' : ''
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-gray-800 text-sm leading-snug break-words ${
              task.completed ? 'line-through text-gray-600' : ''
            }`}>
              {task.description}
            </p>
          )}
        </div>

        {/* Button */}
        <div className="flex-shrink-0 pt-1">
          <button
            onClick={() => onToggle(task.id)}
            className={`px-4 py-1.5 rounded-md text-xs font-medium transition duration-200 ${
              task.completed
                ? 'bg-gray-400 text-gray-700 hover:bg-gray-500'
                : 'bg-white text-gray-800 hover:bg-gray-50 border border-gray-400'
            }`}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
