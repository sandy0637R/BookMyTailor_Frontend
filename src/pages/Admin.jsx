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
  fetchOrdersRequest,
  updateOrderStatusRequest,
} from "../redux/adminSlice";

const Admin = () => {
  const dispatch = useDispatch();
  const { stats, users, cloths, orders } = useSelector((state) => state.admin);

  const [editClothId, setEditClothId] = useState(null);
  const [editForm, setEditForm] = useState({ name: "", price: "" });

  const DELIVERY_STATUSES = ["Pending", "Shipped", "Out for Delivery", "Delivered"];

  useEffect(() => {
    dispatch(fetchStatsRequest());
    dispatch(fetchUsersRequest());
    dispatch(fetchClothsRequest());
    dispatch(fetchOrdersRequest());
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
    dispatch(deleteClothRequest({ clothId }));
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

  const handleUpdateStatus = (order) => {
    const currentIndex = DELIVERY_STATUSES.indexOf(order.deliveryStatus);
    const nextStatus = DELIVERY_STATUSES[currentIndex + 1];

    if (!nextStatus) {
      toast("Order is already delivered");
      return;
    }

    const confirmUpdate = window.confirm(`Change status to "${nextStatus}"?`);
    if (!confirmUpdate) return;

    dispatch(updateOrderStatusRequest({ orderId: order._id, status: nextStatus }));
  };

  const handleCancelOrder = (order) => {
    if (order.deliveryStatus === "Delivered") {
      toast.error("Cannot cancel a delivered order");
      return;
    }

    const confirmCancel = window.confirm("Are you sure you want to cancel this order?");
    if (!confirmCancel) return;

    dispatch(updateOrderStatusRequest({ orderId: order._id, status: "Cancelled" }));
  };

  return (
    <div className="p-6 space-y-12 bg-gray-50 min-h-screen">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-lg font-semibold border-l-4 border-blue-600">
          Total Users
          <div className="mt-2 text-2xl text-blue-600">{stats.totalUsers}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-lg font-semibold border-l-4 border-green-600">
          Tailor Users
          <div className="mt-2 text-2xl text-green-600">{stats.tailors}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-lg font-semibold border-l-4 border-purple-600">
          Customer Users
          <div className="mt-2 text-2xl text-purple-600">{stats.onlyCustomers}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-lg font-semibold border-l-4 border-yellow-500">
          Total Cloths
          <div className="mt-2 text-2xl text-yellow-500">{stats.totalCloths}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md text-center text-lg font-semibold border-l-4 border-red-500">
          Total Posts
          <div className="mt-2 text-2xl text-red-500">{stats.totalPosts}</div>
        </div>
      </div>

      {/* Tailor Users */}
      <h2 className="text-2xl font-bold text-gray-700">Tailor Users</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-medium">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Followers</th>
              <th className="p-3 text-left">Avg Rating</th>
              <th className="p-3 text-left">Custom Req</th>
              <th className="p-3 text-left">Accepted Req</th>
              <th className="p-3 text-left">Following</th>
              <th className="p-3 text-left">Posts</th>
              <th className="p-3 text-left">Block</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tailorUsers.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{new Date(u.tailorDetails?.createdAt).toLocaleDateString()}</td>
                <td className="p-3">{u.tailorDetails?.followers?.length || 0}</td>
                <td className="p-3">{u.tailorDetails?.averageRating || 0}</td>
                <td className="p-3">{u.customDressRequests?.length || 0}</td>
                <td className="p-3">{u.tailorDetails?.acceptedRequests?.length || 0}</td>
                <td className="p-3">{u.following?.length || 0}</td>
                <td className="p-3">{u.tailorDetails?.posts?.length || 0}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleBlock(u._id, u.blocked)}
                    className={`px-3 py-1 rounded font-semibold ${
                      u.blocked
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Users */}
      <h2 className="text-2xl font-bold text-gray-700 mt-8">Customer Users</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-medium">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Following</th>
              <th className="p-3 text-left">Custom Req</th>
              <th className="p-3 text-left">Block</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {customerUsers.map((u) => (
              <tr key={u._id} className="hover:bg-gray-50 transition">
                <td className="p-3">{u.name}</td>
                <td className="p-3">
                  {new Date(parseInt(u._id.substring(0, 8), 16) * 1000).toLocaleDateString()}
                </td>
                <td className="p-3">{u.following?.length || 0}</td>
                <td className="p-3">{u.customDressRequests?.length || 0}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleBlock(u._id, u.blocked)}
                    className={`px-3 py-1 rounded font-semibold ${
                      u.blocked
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-red-600 text-white hover:bg-red-700"
                    }`}
                  >
                    {u.blocked ? "Unblock" : "Block"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Cloths */}
      <h2 className="text-2xl font-bold text-gray-700 mt-8">Cloths</h2>
      <div className="overflow-x-auto rounded-lg shadow-md">
        <table className="min-w-full table-auto border-collapse bg-white divide-y divide-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-sm font-medium">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Tailor / Manufacturer</th>
              <th className="p-3 text-left">Gender</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Created At</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {cloths.map((c) => (
              <tr key={c._id} className="hover:bg-gray-50 transition">
                <td className="p-3">
                  {editClothId === c._id ? (
                    <input
                      value={editForm.name}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    c.name
                  )}
                </td>
                <td className="p-3">{c.tailor?.name || "Manufacturer"}</td>
                <td className="p-3">{c.gender}</td>
                <td className="p-3">
                  {editClothId === c._id ? (
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="border px-2 py-1 rounded w-full"
                    />
                  ) : (
                    `₹${c.price}`
                  )}
                </td>
                <td className="p-3">{new Date(c.createdAt).toLocaleDateString()}</td>
                <td className="p-3 flex space-x-2">
                  {editClothId === c._id ? (
                    <button
                      onClick={() => handleSaveEdit(c._id)}
                      className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => handleEditCloth(c)}
                      className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteCloth(c._id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Orders */}
      <h2 className="text-2xl font-bold text-gray-700 mt-8">Orders</h2>
      <div className="overflow-x-auto rounded-xl shadow-lg bg-white border border-gray-200">
  <table className="min-w-full table-auto border-collapse divide-y divide-gray-200">
    <thead className="bg-gray-50 text-gray-600 uppercase text-sm font-semibold tracking-wide">
      <tr>
        <th className="p-4 text-left">User</th>
        <th className="p-4 text-left">Items</th>
        <th className="p-4 text-left">Total Amount</th>
        <th className="p-4 text-left">Payment Mode</th>
        <th className="p-4 text-left">Address</th>
        <th className="p-4 text-left">Date</th>
        <th className="p-4 text-left">Delivery Status</th>
        <th className="p-4 text-left">Actions</th>
      </tr>
    </thead>
    <tbody className="divide-y divide-gray-100 text-gray-700 text-sm">
      {orders
        .filter(
          (order) =>
            order.deliveryStatus !== "Delivered" &&
            order.deliveryStatus !== "Cancelled"
        )
        .map((order) => (
          <tr
            key={order._id + order.deliveryStatus}
            className="hover:bg-gray-50 transition-colors duration-200"
          >
            <td className="p-4 font-medium">{order.user?.name || "Unknown"}</td>
            <td className="p-4 space-y-1">
              {order.items.map((item) => (
                <div key={item.product?._id}>
                  {item.product?.name} × {item.quantity}
                </div>
              ))}
            </td>
            <td className="p-4 font-semibold text-gray-800">₹{order.totalAmount}</td>
            <td className="p-4">{order.paymentMode}</td>
            <td className="p-4">{order.address}</td>
            <td className="p-4">{new Date(order.createdAt).toLocaleDateString()}</td>
            <td className="p-4 font-semibold text-blue-600">{order.deliveryStatus || "Pending"}</td>
            <td className="p-4 flex flex-col items-center space-y-2">
              <button
                onClick={() => handleUpdateStatus(order)}
                disabled={["Delivered", "Cancelled"].includes(order.deliveryStatus)}
                className={`w-full text-center px-4 py-2 rounded-lg font-semibold text-white ${
                  ["Delivered", "Cancelled"].includes(order.deliveryStatus)
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 transition-colors duration-200"
                }`}
              >
                {(() => {
                  const index = DELIVERY_STATUSES.indexOf(order.deliveryStatus);
                  return DELIVERY_STATUSES[index + 1] || "Completed";
                })()}
              </button>
              {order.deliveryStatus !== "Delivered" &&
                order.deliveryStatus !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelOrder(order)}
                    className="w-full text-center bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
                  >
                    Cancel
                  </button>
                )}
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
