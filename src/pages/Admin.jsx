import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Admin = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    onlyCustomers: 0,
    tailors: 0,
  });

  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/user-stats", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(res.data);
    } catch (err) {
      console.error("Stats fetch error", err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/all", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Users fetch error", err);
    }
  };

  const handleBlock = async (id, isBlocked) => {
    const confirmMsg = isBlocked
      ? "Are you sure you want to unblock this user?"
      : "Are you sure you want to block this user?";
    if (!window.confirm(confirmMsg)) return;

    try {
      const url = isBlocked
        ? `http://localhost:5000/admin/unblock-user/${id}`
        : `http://localhost:5000/admin/block-user/${id}`;

      await axios.put(url, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(isBlocked ? "User unblocked" : "User blocked");
      fetchUsers();
    } catch (err) {
      toast.error("Action failed");
    }
  };

  useEffect(() => {
    fetchStats();
    fetchUsers();
  }, []);

  const tailorUsers = users.filter((u) => u.roles.includes("tailor"));
  const customerUsers = users.filter((u) => JSON.stringify(u.roles) === JSON.stringify(["customer"]));

  return (
    <div className="p-6 space-y-8">
      {/* Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Total Users: {stats.totalUsers}
        </div>
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Tailor Users: {stats.tailors}
        </div>
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Customer Users: {stats.onlyCustomers}
        </div>
      </div>

      {/* Tailor Table */}
      <h2 className="text-2xl font-bold">Tailor Users</h2>
      <div className="overflow-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Followers</th>
              <th className="p-2 border">Avg Rating</th>
              <th className="p-2 border">Custom Req</th>
              <th className="p-2 border">Accepted Req</th>
              <th className="p-2 border">Following</th>
              <th className="p-2 border">Block</th>
            </tr>
          </thead>
          <tbody>
            {tailorUsers.map((u) => (
              <tr key={u._id} className="text-center">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">
                  {new Date(u.tailorDetails?.createdAt).toLocaleDateString()}
                </td>
                <td className="p-2 border">{u.tailorDetails?.followers?.length || 0}</td>
                <td className="p-2 border">{u.tailorDetails?.averageRating || 0}</td>
                <td className="p-2 border">{u.customDressRequests?.length || 0}</td>
                <td className="p-2 border">{u.tailorDetails?.acceptedRequests?.length || 0}</td>
                <td className="p-2 border">{u.following?.length || 0}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleBlock(u._id, u.blocked)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Table */}
      <h2 className="text-2xl font-bold mt-6">Customer Users</h2>
      <div className="overflow-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Following</th>
              <th className="p-2 border">Custom Req</th>
              <th className="p-2 border">Block</th>
            </tr>
          </thead>
          <tbody>
            {customerUsers.map((u) => (
              <tr key={u._id} className="text-center">
                <td className="p-2 border">{u.name}</td>
                <td className="p-2 border">
                  {new Date(parseInt(u._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                </td>
                <td className="p-2 border">{u.following?.length || 0}</td>
                <td className="p-2 border">{u.customDressRequests?.length || 0}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => handleBlock(u._id, u.blocked)}
                    className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
