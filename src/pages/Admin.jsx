import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import DashboardLayout from "../components/DashboardLayout";
import { Search, Plus, RefreshCcw, MoreHorizontal } from "lucide-react";
import { useToast } from "../context/ToastContext";
import { db } from "../firebase/client";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Navigate } from "react-router-dom";

const PAGE_SIZE = 5;

const AdminPanel = () => {
  const { user, isLoading } = useAuth();
  const { showToast } = useToast();

  // 🔒 Protect the page
  if (isLoading) return <p className="p-6">Loading...</p>;
  if (!user) return <Navigate to="/login" />;
  if (user.role !== "Admin") return <Navigate to="/" />;

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);

  // Add User modal state
  const [addOpen, setAddOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Agent" });
  const [saving, setSaving] = useState(false);

  // Handle actions
  const handleAction = async (id, action) => {
    try {
      if (action === "Delete") {
        await deleteDoc(doc(db, "managed_users", id));
        showToast("User deleted", "success");
      } else if (action === "Disable") {
        await updateDoc(doc(db, "managed_users", id), { status: "Disabled" });
        showToast("User disabled", "success");
      } else if (action === "Suspend") {
        await updateDoc(doc(db, "managed_users", id), { status: "Suspended" });
        showToast("User suspended", "success");
      } else if (action === "View") {
        const target = users.find((u) => u.id === id);
        if (target) showToast(`${target.name} • ${target.email}`, "info");
      } else if (action === "Edit") {
        showToast("Open edit user modal (todo)", "info");
      }
    } catch (error) {
      console.error(error);
      showToast("Action failed", "error");
    }
    setDropdownOpen(null);
  };

  // Search + Pagination
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

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

  // Bulk action
  const handleBulkAction = async (action) => {
    setActionLoading(true);
    try {
      await Promise.all(
        selectedUsers.map((userId) =>
          updateDoc(doc(db, "managed_users", userId), { status: action })
        )
      );
      setSelectedUsers([]);
      showToast(`Bulk ${action} completed`, "success");
    } catch (error) {
      console.error(error);
      showToast("Bulk action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  // Fetch users
  useEffect(() => {
    setIsLoadingUsers(true);
    const unsub = onSnapshot(
      collection(db, "managed_users"),
      (snap) => {
        const rows = snap.docs.map((d) => {
          const data = d.data();
          const last = data.lastLogin?.toDate
            ? data.lastLogin.toDate().toLocaleString()
            : "-";
          return {
            id: d.id,
            name: data.name || "",
            email: data.email || "",
            role: data.role || "Agent",
            status: data.status || "Active",
            lastLogin: last,
          };
        });
        setUsers(rows);
        setIsLoadingUsers(false);
      },
      (err) => {
        console.error(err);
        setIsLoadingUsers(false);
      }
    );
    return () => unsub();
  }, []);

  // Add user
  const saveNewUser = async (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const email = form.email.trim();

    if (!name || !email) {
      showToast("Name and email are required", "warning");
      return;
    }
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      showToast("Email already exists", "warning");
      return;
    }

    setSaving(true);
    try {
      await addDoc(collection(db, "managed_users"), {
        name,
        email,
        role: form.role,
        status: "Active",
        lastLogin: null,
        createdAt: serverTimestamp(),
        createdBy: user?.uid || null,
      });
      setForm({ name: "", email: "", role: "Agent" });
      setAddOpen(false);
      showToast("User added", "success");
    } catch (err) {
      console.error(err);
      showToast("Failed to add user", "error");
    } finally {
      setSaving(false);
    }
  };

  // Stats
  const activeCount = users.filter((u) => u.status === "Active").length;
  const disabledCount = users.filter(
    (u) => u.status === "Disabled" || u.status === "Suspended"
  ).length;

  return (
    <DashboardLayout>
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Search + Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-xl shadow mb-6 gap-3">
          <div className="flex items-center w-full sm:w-1/2 rounded-lg shadow px-5 py-3">
            <Search className="w-5 h-5 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search users by name, email or role..."
              className="w-full outline-none text-gray-600"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setAddOpen(true)}
              className="flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg shadow hover:bg-green-600"
            >
              <Plus size={16} /> Add User
            </button>
            <button
              onClick={() => {
                setIsLoadingUsers(true);
                setTimeout(() => {
                  setIsLoadingUsers(false);
                  showToast("Refreshed", "success");
                }, 500);
              }}
              className="flex items-center gap-2 border px-3 py-2 rounded-lg shadow hover:bg-gray-100"
            >
              <RefreshCcw size={16} /> Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Total Users</p>
            <h2 className="text-2xl font-bold">{users.length}</h2>
            <p className="text-sm text-gray-400">All registered accounts</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Active</p>
            <h2 className="text-2xl font-bold">{activeCount}</h2>
            <p className="text-sm text-gray-400">Currently active</p>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-gray-500">Suspended / Disabled</p>
            <h2 className="text-2xl font-bold">{disabledCount}</h2>
            <p className="text-sm text-gray-400">Require review</p>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedUsers.length > 0 && (
          <div className="flex gap-2 mb-4">
            {["Active", "Disabled", "Suspended"].map((action) => (
              <button
                key={action}
                disabled={actionLoading}
                onClick={() => handleBulkAction(action)}
                className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              >
                Set {action}
              </button>
            ))}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100 text-left text-gray-600 text-sm">
              <tr>
                <th className="p-3">
                  <input
                    type="checkbox"
                    onChange={(e) =>
                      setSelectedUsers(
                        e.target.checked ? paginatedUsers.map((u) => u.id) : []
                      )
                    }
                    checked={
                      selectedUsers.length === paginatedUsers.length &&
                      paginatedUsers.length > 0
                    }
                  />
                </th>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
                <th className="p-3">Last login</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {paginatedUsers.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(u.id)}
                      onChange={(e) =>
                        setSelectedUsers(
                          e.target.checked
                            ? [...selectedUsers, u.id]
                            : selectedUsers.filter((id) => id !== u.id)
                        )
                      }
                    />
                  </td>
                  <td className="p-3 whitespace-nowrap">{u.name}</td>
                  <td className="p-3 whitespace-nowrap">{u.email}</td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        u.role === "Admin"
                          ? "bg-yellow-100 text-yellow-700"
                          : u.role === "Manager"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        u.status === "Active"
                          ? "bg-green-100 text-green-700"
                          : u.status === "Disabled"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="p-3 whitespace-nowrap">{u.lastLogin}</td>
                  <td className="p-3 relative">
                    <button
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === u.id ? null : u.id)
                      }
                      className="p-2 rounded hover:bg-gray-100"
                    >
                      <MoreHorizontal />
                    </button>
                    {dropdownOpen === u.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg border rounded-lg z-10">
                        {["View", "Edit", "Disable", "Suspend", "Delete"].map(
                          (action) => (
                            <button
                              key={action}
                              onClick={() => handleAction(u.id, action)}
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
              {!isLoadingUsers && paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">
                    No users found.
                  </td>
                </tr>
              )}
              {isLoadingUsers && (
                <tr>
                  <td colSpan={7} className="text-center p-6 text-gray-400">
                    Loading users...
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between p-3 text-sm text-gray-500">
            <p>
              Showing {(currentPage - 1) * PAGE_SIZE + 1}-
              {Math.min(currentPage * PAGE_SIZE, totalUsers)} of {totalUsers}{" "}
              users
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

        {/* Add User Modal */}
        {addOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
            <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Add User</h3>
              <form onSubmit={saveNewUser} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    value={form.role}
                    onChange={(e) =>
                      setForm({ ...form, role: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option>Agent</option>
                    <option>Manager</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddOpen(false)}
                    className="px-4 py-2 border rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPanel;
