import React, { useState, useEffect } from "react";
import userBaseUrl from "../../../axioInstance";
import { Trash2, Edit2, X, Check } from "lucide-react";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await userBaseUrl.get("/users");
      const nonAdminUsers = res.data.filter((u) => u.role !== "admin");
      setUsers(nonAdminUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    try {
      await userBaseUrl.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  const startEditing = (user) => {
    setEditingId(user._id);
    setEditFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      address: user.address || "",
    });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleSaveUpdate = async (id) => {
    try {
      const res = await userBaseUrl.patch(`/users/${id}`, editFormData);
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
      setEditingId(null);
      alert("User profile updated successfully");
    } catch (err) {
      alert("Update failed");
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    return u.role === filter;
  });

  if (loading) return <div className="p-10 text-center">Loading users...</div>;

  return (
    <div className="p-4 sm:p-6 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
          <span className="text-sm text-gray-500 font-medium">
            Total Users: {users.length}
          </span>
        </div>

        <div className="flex gap-3 mb-8">
          {["all", "customer", "artist"].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-5 py-2 rounded-xl capitalize transition font-medium whitespace-nowrap  ${
                filter === type
                  ? "bg-black text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="grid gap-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4"
            >
              {editingId === user._id ? (
                /* --- EDIT MODE --- */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <input
                      name="firstName"
                      value={editFormData.firstName}
                      onChange={handleEditChange}
                      className="border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="First Name"
                    />
                    <input
                      name="lastName"
                      value={editFormData.lastName}
                      onChange={handleEditChange}
                      className="border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Last Name"
                    />
                    <input
                      name="email"
                      value={editFormData.email}
                      onChange={handleEditChange}
                      className="border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Email"
                    />
                    <input
                      name="phone"
                      value={editFormData.phone}
                      onChange={handleEditChange}
                      className="border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                      placeholder="Phone"
                    />
                  </div>
                  <textarea
                    name="address"
                    value={editFormData.address}
                    onChange={handleEditChange}
                    className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none resize-none"
                    placeholder="Residential/Studio Address"
                    rows="2"
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveUpdate(user._id)}
                      className="px-4 py-2 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-600 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              ) : (
                /* --- DISPLAY MODE --- */
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {user.firstName} {user.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {user.email} •{" "}
                      <span
                        className={`capitalize font-bold ${
                          user.role === "artist"
                            ? "text-blue-600"
                            : "text-orange-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </p>
                    <p className="text-xs text-gray-400 mt-2 italic">
                      {user.address || "No address provided"}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right mr-4">
                      <p className="text-[10px] text-gray-400 uppercase font-black tracking-wider">
                        Phone
                      </p>
                      <p className="text-sm font-semibold text-gray-700">
                        {user.phone}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditing(user)}
                        className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                        title="Edit Profile"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition"
                        title="Delete User"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed">
            <p className="text-gray-400 font-medium">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
