import React, { useState } from "react";

const TaskForm = ({ onAddTask }) => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleAddTask = async () => {
    const { title, description } = formData;
    if (!title.trim() || submitting) return;

    setSubmitting(true);
    const result = await onAddTask({ title: title.trim(), description: description.trim() });

    if (result?.success) setFormData({ title: "", description: "" });
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
      <h2 className="text-2xl font-bold text-gray-900">Add New Task</h2>

      <div className="flex flex-col gap-4">
        <input
          id="title"
          type="text"
          placeholder="Enter task title"
          value={formData.title}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          className="w-full h-12 px-4 text-base rounded-lg border border-gray-300
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none
                     transition-all shadow-sm"
        />

        <textarea
          id="description"
          placeholder="Enter task description"
          value={formData.description}
          onChange={handleChange}
          className="w-full min-h-[100px] px-4 py-3 text-base rounded-lg border border-gray-300
                     focus:border-blue-500 focus:ring-2 focus:ring-blue-500 outline-none
                     transition-all resize-none shadow-sm"
        />

        <button
          onClick={handleAddTask}
          disabled={submitting || !formData.title.trim()}
          className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold
                     rounded-lg transition duration-200 shadow-sm hover:shadow-md
                     disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {submitting ? "Adding Task..." : "Add Task"}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
