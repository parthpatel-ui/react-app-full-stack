import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";
import TaskModal from "../components/TaskModal";
import DeleteModal from "../components/DeleteModal";

const Dashboard = () => {
	const [tasks, setTasks] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("");
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isEditMode, setIsEditMode] = useState(false);
	const [taskData, setTaskData] = useState({
		title: "",
		description: "",
		status: "Pending",
	});
	const [taskToDelete, setTaskToDelete] = useState(null);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const navigate = useNavigate();

	const getTokenFromLocalStorage = () => {
		const token = localStorage.getItem("token");
		return token;
	};

	const fetchTasks = useCallback(() => {
		setLoading(true);
		const token = getTokenFromLocalStorage();
		if (!token) {
			navigate("/"); // 🔥 Redirect to login if no token is found
			return;
		}
		let url = `http://localhost:3000/api/tasks?page=${currentPage}&limit=${pageSize}`;
		if (searchQuery) url += `&search=${searchQuery}`;
		if (statusFilter) url += `&status=${statusFilter}`;

		fetch(url, {
			method: "GET",
			headers: {
				Authorization: `Bearer ${token}`, // 🔥 Send token in header
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				setTasks(data.tasks);
				setTotalPages(data.pagination.totalPages);
				setPageSize(data.pagination.pageSize);
				setLoading(false);
			})
			.catch(() => navigate("/"));
	}, [currentPage, searchQuery, statusFilter, pageSize, navigate]);

	useEffect(() => {
		fetchTasks();
	}, [fetchTasks]);

	const handleSubmitTask = (e) => {
		e.preventDefault();
		const method = isEditMode ? "PUT" : "POST";
		const endpoint = isEditMode
			? `http://localhost:3000/api/tasks/${taskData._id}`
			: "http://localhost:3000/api/tasks";
		const token = getTokenFromLocalStorage();
		if (!token) {
			navigate("/"); // 🔥 Redirect to login if no token is found
			return;
		}
		fetch(endpoint, {
			method,
			headers: {
				Authorization: `Bearer ${token}`, // 🔥 Send token in header
				"Content-Type": "application/json",
			},
			credentials: "include",
			body: JSON.stringify(taskData),
		})
			.then(() => {
				setIsModalOpen(false);
				fetchTasks();
			})
			.catch(console.error);
	};

	const handleEdit = (task) => {
		setTaskData(task);
		setIsEditMode(true);
		setIsModalOpen(true);
	};

	const handleDeleteConfirm = (task) => {
		setTaskToDelete(task);
		setShowDeleteConfirm(true);
	};

	const handleDelete = () => {
		const token = getTokenFromLocalStorage();
		if (!token) {
			navigate("/"); // 🔥 Redirect to login if no token is found
			return;
		}
		fetch(`http://localhost:3000/api/tasks/${taskToDelete._id}`, {
			method: "DELETE",
			headers: {
				Authorization: `Bearer ${token}`, // 🔥 Send token in header
				"Content-Type": "application/json",
			},
		})
			.then(() => {
				setShowDeleteConfirm(false);
				fetchTasks();
			})
			.catch(console.error);
	};

	return (
		<div className="flex flex-col items-center min-h-screen p-6">
			<h1 className="text-3xl font-bold mb-4">Task Management</h1>

			<div className="flex space-x-4 mb-4">
				<div className="flex items-center border px-3 py-2 rounded">
					<FaSearch className="mr-2" />
					<input
						type="text"
						placeholder="Search tasks..."
						className="outline-none"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
				</div>

				<select
					className="border px-3 py-2 rounded"
					value={statusFilter}
					onChange={(e) => setStatusFilter(e.target.value)}
				>
					<option value="">All Status</option>
					<option value="Pending">Pending</option>
					<option value="In Progress">In Progress</option>
					<option value="Completed">Completed</option>
				</select>

				<button
					className="px-4 py-2 bg-green-500 text-white rounded flex items-center"
					onClick={() => {
						setIsEditMode(false);
						setIsModalOpen(true);
					}}
				>
					<FaPlus className="mr-2" /> Add Task
				</button>
			</div>

			{loading ? (
				<p className="text-xl text-gray-600">🔄 Loading tasks...</p>
			) : (
				<table className="w-full max-w-4xl bg-white shadow-lg rounded-lg">
					<thead className="bg-gray-200">
						<tr>
							<th className="border border-gray-300 px-4 py-2">SR No.</th>
							<th className="border border-gray-300 px-4 py-2">ID</th>
							<th className="border border-gray-300 px-4 py-2">Title</th>
							<th className="border border-gray-300 px-4 py-2">Status</th>
							<th className="border border-gray-300 px-4 py-2">Created At</th>
							<th className="border border-gray-300 px-4 py-2">Actions</th>
						</tr>
					</thead>
					<tbody>
						{tasks.map((task, index) => (
							<tr key={task._id}>
								<td className="border border-gray-300 px-4 py-2">
									{index + 1 + (currentPage - 1) * pageSize}
								</td>
								<td className="border border-gray-300 px-4 py-2">{task._id}</td>
								<td className="border border-gray-300 px-4 py-2">{task.title}</td>
								<td className="border border-gray-300 px-4 py-2">{task.status}</td>
								<td className="border border-gray-300 px-4 py-2">
									{new Date(task.createdAt).toLocaleDateString()}
								</td>
								<td className="border border-gray-300 px-4 py-2 flex space-x-2">
									<button
										className="text-blue-500"
										onClick={() => handleEdit(task)}
									>
										<FaEdit />
									</button>
									<button
										className="text-red-500"
										onClick={() => handleDeleteConfirm(task)}
									>
										<FaTrash />
									</button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
			)}

			<div className="flex mt-4 items-center">
				<button
					onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
					disabled={currentPage === 1}
				>
					⬅ Prev
				</button>
				<span className="px-4">
					{currentPage} of {totalPages}
				</span>
				<button
					onClick={() =>
						setCurrentPage((prev) => Math.min(prev + 1, totalPages))
					}
					disabled={currentPage === totalPages}
				>
					Next ➡
				</button>
			</div>

			<TaskModal
				isOpen={isModalOpen}
				onClose={() => setIsModalOpen(false)}
				onSubmit={handleSubmitTask}
				taskData={taskData}
				setTaskData={setTaskData}
				isEditMode={isEditMode}
			/>

			<DeleteModal
				isOpen={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={handleDelete}
				taskTitle={taskToDelete?.title}
			/>
		</div>
	);
};

export default Dashboard;
