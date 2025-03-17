import React from "react";
import Modal from "react-modal";

// Set the root for accessibility
Modal.setAppElement("#root");

const TaskModal = ({ isOpen, onClose, onSubmit, taskData, setTaskData, isEditMode }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel={isEditMode ? "Edit Task" : "Add Task"}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold mb-4">{isEditMode ? "Edit Task" : "Add Task"}</h2>
        
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Task Title"
            className="w-full p-2 border rounded"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            required
          />

          {/* Description */}
          <textarea
            placeholder="Description (Optional)"
            className="w-full p-2 border rounded"
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
          />

          {/* Status Dropdown */}
          <select
            className="w-full p-2 border rounded"
            value={taskData.status}
            onChange={(e) => setTaskData({ ...taskData, status: e.target.value })}
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Buttons */}
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-400 text-white rounded">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
              {isEditMode ? "Update Task" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default TaskModal;
