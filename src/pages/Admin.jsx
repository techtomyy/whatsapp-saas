import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { Search, Plus, RefreshCcw, MoreHorizontal } from "lucide-react";
import { userService } from '../services/userService';

// Pagination settings
const PAGE_SIZE = 5;

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@wb.app",
      role: "Agent",
      status: "Active",
      lastLogin: "Aug 10, 2025 09:22 PM",
    },
    {
      id: 2,
      name: "Michael Brown",
      email: "michael@wb.app",
      role: "Admin",
      status: "Active",
      lastLogin: "Aug 10, 2025 02:45 PM",
    },
    {
      id: 3,
      name: "Marketing Team",
      email: "mar@wb.app",
      role: "Manager",
      status: "Active",
      lastLogin: "Aug 3, 2025 10:04 AM",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@wb.app",
      role: "Agent",
      status: "Disabled",
      lastLogin: "July 27, 2025 07:00 PM",
    },
    {
      id: 5,
      name: "Amanda Rodriguez",
      email: "amanda@wb.app",
      role: "Agent",
      status: "Suspended",
      lastLogin: "July 25, 2025 11:32 PM",
    },
    {
      id: 2,
      name: "Michael Brown",
      email: "michael@wb.app",
      role: "Admin",
      status: "Active",
      lastLogin: "Aug 10, 2025 02:45 PM",
    },
    {
      id: 3,
      name: "Marketing Team",
      email: "mar@wb.app",
      role: "Manager",
      status: "Active",
      lastLogin: "Aug 3, 2025 10:04 AM",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@wb.app",
      role: "Agent",
      status: "Disabled",
      lastLogin: "July 27, 2025 07:00 PM",
    },
    {
      id: 5,
      name: "Amanda Rodriguez",
      email: "amanda@wb.app",
      role: "Agent",
      status: "Suspended",
      lastLogin: "July 25, 2025 11:32 PM",
    },
  ]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  const handleAction = (id, action) => {
    if (action === "Delete") {
      setUsers(users.filter((u) => u.id !== id));
    } else if (action === "Disable") {
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, status: "Disabled" } : u
        )
      );
    } else if (action === "Suspend") {
      setUsers(
        users.map((u) =>
          u.id === id ? { ...u, status: "Suspended" } : u
        )
      );
    } else {
      alert(`${action} action clicked for user ID: ${id}`);
    }
    setDropdownOpen(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination logic
  const totalUsers = filteredUsers.length;
  const totalPages = Math.ceil(totalUsers / PAGE_SIZE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setDropdownOpen(null);
  };

  const handleBulkAction = async (action) => {
    setActionLoading(true);
    try {
      await Promise.all(
        selectedUsers.map(userId => 
          userService.updateUserStatus(userId, action)
        )
      );
      // Refresh user list
      setSelectedUsers([]);
    } catch (error) {
      // Show error toast
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    // Simulate data fetching
    const fetchData = () => {
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow mb-6 gap-3">
          <div className="flex items-center w-full sm:w-1/2  rounded-lg shadow px-5 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search users by name, email or role..."
              className="w-full outline-none text-gray-600   border-gray-500"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg shadow hover:bg-green-600">
              <Plus size={16} /> Add User
            </button>
            <button className="flex items-center gap-2 border px-3 py-2 rounded-lg shadow hover:bg-gray-100">
              <RefreshCcw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold">1,284</h2>
            <p className="text-sm text-gray-400">All registered accounts</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Active</p>
            <h2 className="text-2xl font-bold">1,102</h2>
            <span className="text-green-600 text-sm bg-green-100 px-2 py-0.5 rounded-full">
              +18 today
            </span>
            <p className="text-sm text-gray-400">Logged in last 30 days</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Suspended / Disabled</p>
            <h2 className="text-2xl font-bold">182</h2>
            <p className="text-sm text-gray-400">Require view</p>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="mb-4 flex gap-2">
          <button 
            onClick={() => handleBulkAction('activate')}
            disabled={selectedUsers.length === 0 || actionLoading}
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Activate Selected
          </button>
          <button 
            onClick={() => handleBulkAction('deactivate')}
            disabled={selectedUsers.length === 0 || actionLoading}
            className="px-4 py-2 bg-yellow-500 text-white rounded"
          >
            Deactivate Selected
          </button>
          <button 
            onClick={() => handleBulkAction('delete')}
            disabled={selectedUsers.length === 0 || actionLoading}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Delete Selected
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-left text-gray-600 text-sm">
              <tr>
                
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last login</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  
                  <td className="p-3 whitespace-nowrap">{user.name}</td>
                  <td className="p-3 whitespace-nowrap">{user.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.role === "Admin"
                          ? "bg-yellow-100 text-yellow-700"
                          : user.role === "Manager"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        user.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : user.status === "Disabled"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{user.lastLogin}</td>
                  <td className="p-3 relative">
                    <button
                      onClick={() =>
                        setDropdownOpen(
                          dropdownOpen === user.id ? null : user.id
                        )
                      }
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <MoreHorizontal />
                    </button>
                    {dropdownOpen === user.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg z-10">
                        {["View", "Edit", "Disable", "Suspend", "Delete"].map(
                          (action) => (
                            <button
                              key={action}
                              onClick={() => handleAction(user.id, action)}
                              className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
                                action === "Delete"
                                  ? "text-red-500"
                                  : "text-gray-700"
                              }`}
                            >
                              {action}
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-3 text-sm text-gray-500">
            <p>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, totalUsers)} of {totalUsers} users
            </p>
            <div className="flex gap-1">
              <button
                className="px-2 py-1 border rounded hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &lt;
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx + 1}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1
                      ? "bg-gray-200"
                      : "hover:bg-gray-100"
                  }`}
                  onClick={() => handlePageChange(idx + 1)}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                className="px-2 py-1 border rounded hover:bg-gray-100"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
