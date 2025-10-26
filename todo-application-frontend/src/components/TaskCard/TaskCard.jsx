import React from 'react';

const TaskCard = ({ task, onToggle }) => {
  return (
    <div
      className={`bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl min-h-[110px] 
                  transition-all duration-300 hover:shadow-xl hover:scale-[1.02] p-6 
                  border-2 border-purple-300 shadow-lg transform
                  ${task.completed ? 'opacity-60 scale-95' : 'hover:-translate-y-1'}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 data-testid="task-title" className={`text-lg font-bold text-purple-900 mb-2 break-words leading-tight ${
            task.completed ? 'line-through text-purple-600' : ''
          }`}>
            {task.title}
          </h3>
          {task.description && (
            <p data-testid="task-description" className={`text-purple-800 text-sm leading-relaxed break-words ${
              task.completed ? 'line-through text-purple-600' : ''
            }`}>
              {task.description}
            </p>
          )}
        </div>

        <div className="flex-shrink-0">
          <button
            onClick={() => onToggle(task.id)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-300 
                       transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg
                       ${
              task.completed
                ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white hover:from-purple-600 hover:to-purple-700'
                : 'bg-white text-purple-700 hover:bg-purple-50 border-2 border-purple-400 hover:border-purple-600'
            }`}
          >
            {task.completed ? (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7"></path>
                </svg>
                Done
              </span>
            ) : (
              'Done'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
