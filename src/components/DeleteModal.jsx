import React from "react";
import Modal from "react-modal";

Modal.setAppElement("#root"); // Ensure accessibility compliance

const DeleteModal = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Delete Confirmation"
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-xl font-semibold mb-4">Are you sure ? You want to delete {taskTitle}</h2>
        <p className="text-gray-600 mb-4">This action cannot be undone.</p>
        
        <div className="flex justify-around">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
