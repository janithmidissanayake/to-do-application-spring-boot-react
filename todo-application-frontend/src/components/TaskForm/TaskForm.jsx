import React, { useState, useEffect } from "react";

const TaskForm = ({ onAddTask }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Auto-hide success alert after 3 seconds
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddTask = async () => {
    const { title, description } = formData;
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    const result = await onAddTask({ title: title.trim(), description: description.trim() });

    if (result?.success) {
      setFormData({ title: "", description: "" });
      setShowSuccess(true);
    }
    setSubmitting(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddTask();
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col gap-6">
      <div className="text-center mb-2">
        <h2 className="text-3xl font-extrabold text-purple-900 mb-2 tracking-tight">Add New Task</h2>
        <p className="text-purple-600 text-sm">Create and organize your tasks efficiently</p>
      </div>
      
      {/* Success Notification */}
      {showSuccess && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 rounded-xl px-5 py-4 flex items-center gap-4 shadow-lg animate-slideDown">
          {/* Purple checkmark icon with animation */}
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center shadow-md animate-scale">
            <svg 
              className="w-6 h-6 text-white" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="3" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          {/* Success message */}
          <span className="flex-1 text-purple-900 font-semibold text-base">Task added successfully! 🎉</span>
          
          {/* Close button */}
          <button
            onClick={() => setShowSuccess(false)}
            className="flex-shrink-0 text-purple-400 hover:text-purple-700 transition-all duration-200 hover:scale-110"
            aria-label="Close"
          >
            <svg 
              className="w-5 h-5" 
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      )}

      <div className="flex flex-col gap-5">
        <input
          id="title"
          type="text"
          placeholder="Enter task title..."
          value={formData.title}
          data-testid="task-title-input"
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="w-full h-14 px-5 text-base rounded-xl border-2 border-purple-300
                     focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none
                     transition-all duration-300 shadow-md hover:shadow-lg bg-white
                     placeholder:text-purple-300"
        />

        <textarea
          id="description"
          placeholder="Enter task description (optional)..."
          data-testid="task-description-input"
          value={formData.description}
          onChange={handleChange}
          className="w-full min-h-[120px] px-5 py-4 text-base rounded-xl border-2 border-purple-300
                     focus:border-purple-500 focus:ring-4 focus:ring-purple-200 outline-none
                     transition-all duration-300 resize-none shadow-md hover:shadow-lg bg-white
                     placeholder:text-purple-300"
        />

        <button
          onClick={handleAddTask}
          disabled={submitting || !formData.title.trim()}
          data-testid="add-task-button"
          className="w-full h-14 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 
                     text-white font-bold text-lg rounded-xl transition-all duration-300 
                     shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0
                     disabled:from-purple-300 disabled:to-purple-400 disabled:cursor-not-allowed 
                     disabled:transform-none disabled:shadow-md
                     flex items-center justify-center gap-2"
        >
          {submitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding Task...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 4v16m8-8H4"></path>
              </svg>
              Add Task
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
