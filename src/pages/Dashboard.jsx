import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
	const [todos, setTodos] = useState([]);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [pageSize, setPageSize] = useState(10);
	const [loading, setLoading] = useState(true);

	const navigate = useNavigate();

	const fetchTodos = useCallback(
		(page) => {
			setLoading(true);
			const token = getTokenFromLocalStorage();
			if (!token) {
				navigate("/"); // 🔥 Redirect to login if no token is found
				return;
			}
			fetch(`http://localhost:3000/api/tasks?page=${page}`, {
				method: "GET",
				headers: {
					Authorization: `Bearer ${token}`, // 🔥 Send token in header
					"Content-Type": "application/json",
				},
			})
				.then((res) => {
					if (res.status === 401) {
						throw new Error("Unauthorized");
					}
					return res.json();
				})
				.then((data) => {
					setTodos(data.tasks);
					setTotalPages(data.pagination.totalPages);
					setPageSize(data.pagination.pageSize);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Error fetching todos:", err);
					navigate("/");
				});
		},
		[navigate]
	);

	useEffect(() => {
		fetchTodos(currentPage);
	}, [fetchTodos, currentPage]);

	const getTokenFromLocalStorage = () => {
		const token = localStorage.getItem("token");
		return token;
	};

	const handlePageChange = (page) => {
		if (page > 0 && page <= totalPages) {
			setCurrentPage(page);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/");
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-6">
			<h1 className="text-3xl font-bold mb-4">Your Todos</h1>

			{loading ? (
				<div className="flex flex-col items-center">
					<div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
					<p className="mt-2 text-xl text-gray-600">Loading tasks...</p>
				</div>
			) : (
				<>
					<div className="overflow-x-auto w-full max-w-4xl bg-white shadow-lg rounded-lg">
						<table className="w-full border-collapse border border-gray-300">
							<thead className="bg-gray-200">
								<tr>
									<th className="border border-gray-300 px-4 py-2">SR No.</th>
									<th className="border border-gray-300 px-4 py-2">ID</th>
									<th className="border border-gray-300 px-4 py-2">Title</th>
									<th className="border border-gray-300 px-4 py-2">Status</th>
								</tr>
							</thead>
							<tbody>
								{todos.length > 0 ? (
									todos.map((todo, index) => (
										<tr key={todo._id} className="text-center">
											<td className="border border-gray-300 px-4 py-2">
												{index + 1 + (currentPage - 1) * pageSize}
											</td>
											<td className="border border-gray-300 px-4 py-2">
												{todo._id}
											</td>
											<td className="border border-gray-300 px-4 py-2">
												{todo.title}
											</td>
											<td className="border border-gray-300 px-4 py-2">
												{todo.status === "Completed"
													? "✅ Completed"
													: "❌ Pending"}
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="3" className="text-center py-4 text-gray-500">
											No todos found
										</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					<div className="flex mt-4 space-x-2">
						<button
							className="px-4 py-2 bg-gray-300 rounded"
							onClick={() => handlePageChange(currentPage - 1)}
							disabled={currentPage === 1}
						>
							⬅️ Prev
						</button>
						<span className="px-4 py-2 border rounded">
							Page {currentPage} of {totalPages}
						</span>
						<button
							className="px-4 py-2 bg-gray-300 rounded"
							onClick={() => handlePageChange(currentPage + 1)}
							disabled={currentPage === totalPages}
						>
							Next ➡️
						</button>
					</div>
				</>
			)}
			<button
				onClick={handleLogout}
				className="mt-6 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
			>
				Logout
			</button>
		</div>
	);
};

export default Dashboard;
