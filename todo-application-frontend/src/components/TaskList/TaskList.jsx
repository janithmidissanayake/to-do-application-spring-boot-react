import TaskCard from '../TaskCard/TaskCard.jsx';

const TaskList = ({ tasks, onToggle }) => {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <p className="text-white text-xl md:text-2xl font-bold mb-2">No tasks yet!</p>
          <p className="text-purple-100 text-sm md:text-base">Add your first task to get started 🚀</p>
        </div>
      </div>
    );
  }

  return (
   <div className="flex flex-col gap-5 overflow-y-auto pr-2 flex-1 custom-scrollbar">
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