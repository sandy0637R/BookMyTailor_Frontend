import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import {
  fetchStatsRequest,
  fetchUsersRequest,
  fetchClothsRequest,
  blockUnblockUserRequest,
  deleteClothRequest,
  editClothRequest,
} from "../redux/adminSlice";

const Admin = () => {
  const dispatch = useDispatch();

  const { stats, users, cloths } = useSelector((state) => state.admin);

  const [editClothId, setEditClothId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "" });

  useEffect(() => {
    dispatch(fetchStatsRequest());
    dispatch(fetchUsersRequest());
    dispatch(fetchClothsRequest());
  }, [dispatch]);

  const handleBlock = (id, isBlocked) => {
    const confirmMsg = isBlocked
      ? "Are you sure you want to unblock this user?"
      : "Are you sure you want to block this user?";
    if (!window.confirm(confirmMsg)) return;

    dispatch(blockUnblockUserRequest({ id, isBlocked }));
  };

  const handleDeleteCloth = (clothId) => {
    if (!window.confirm("Are you sure you want to delete this cloth?")) return;
    dispatch(deleteClothRequest({clothId}));
  };

  const handleEditCloth = (cloth) => {
    setEditClothId(cloth._id);
    setEditForm({ name: cloth.name, price: cloth.price });
  };

  const handleSaveEdit = (clothId) => {
    if (!window.confirm("Do you want to save the changes?")) return;
    dispatch(editClothRequest({ clothId, name: editForm.name, price: editForm.price }));
    setEditClothId(null);
  };

  const tailorUsers = users.filter((u) => u.roles.includes("tailor"));
  const customerUsers = users.filter(
    (u) => JSON.stringify(u.roles) === JSON.stringify(["customer"])
  );

  return (
    <div className="p-6 space-y-8">
      {/* Stats Block */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Total Users: {stats.totalUsers}
        </div>
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Tailor Users: {stats.tailors}
        </div>
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Customer Users: {stats.onlyCustomers}
        </div>
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Total Cloths: {stats.totalCloths}
        </div>
        <div className="bg-gray-100 p-6 text-center rounded shadow text-xl font-semibold">
          Total Posts: {stats.totalPosts}
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
              <th className="p-2 border">Posts</th>
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
                <td className="p-2 border">{u.tailorDetails?.posts?.length || 0}</td>
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

      {/* Cloths Table */}
      <h2 className="text-2xl font-bold mt-6">Cloths</h2>
      <div className="overflow-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Tailor / Manufacturer</th>
              <th className="p-2 border">Gender</th>
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Created At</th>
              <th className="p-2 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {cloths.map((c) => (
              <tr key={c._id} className="text-center">
                <td className="p-2 border">
                  {editClothId === c._id ? (
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border px-2 py-1"
                    />
                  ) : (
                    c.name
                  )}
                </td>
                <td className="p-2 border">{c.tailor?.name || "Manufacturer"}</td>
                <td className="p-2 border">{c.gender}</td>
                <td className="p-2 border">
                  {editClothId === c._id ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="border px-2 py-1"
                    />
                  ) : (
                    `₹${c.price}`
                  )}
                </td>
                <td className="p-2 border">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-2 border space-x-2">
                  {editClothId === c._id ? (
                    <button
                      onClick={() => handleSaveEdit(c._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditCloth(c)}
                      className="bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCloth(c._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded"
                  >
                    Delete
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
