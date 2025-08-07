import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersRequest, deleteOrderRequest } from "../redux/orderSlice";
import { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import ClothDetails from "../components/ClothDetails";

const MyOrders = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orders = useSelector((state) => state.order.orders);

  const [showHistory, setShowHistory] = useState(false);
  const [showClothDetails, setShowClothDetails] = useState(false);
  const [selectedClothId, setSelectedClothId] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchOrdersRequest({ token }));
    }
  }, [dispatch, token]);

  const historyOrders = orders.filter(
    (order) =>
      order.deliveryStatus?.toLowerCase() === "delivered" ||
      order.deliveryStatus?.toLowerCase() === "cancelled"
  );

  const activeOrders = orders.filter(
    (order) =>
      order.deliveryStatus?.toLowerCase() !== "delivered" &&
      order.deliveryStatus?.toLowerCase() !== "cancelled"
  );

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  const handleDelete = (orderId) => {
    const confirmed = window.confirm("Are you sure you want to delete this order?");
    if (!confirmed) return;
    dispatch(deleteOrderRequest({ token, orderId }));
  };

  const handleViewProduct = (productId) => {
    setSelectedClothId(productId);
    setShowClothDetails(true);
  };

  const handleCloseClothDetails = () => {
    setShowClothDetails(false);
    setSelectedClothId(null);
  };

  return (
    <div className="p-6 md:p-10  bg-gray-50 min-h-screen">
      <h2 className="text-4xl font-bold mb-10 text-center text-gray-900 tracking-tight">My Orders</h2>

      {/* Active Orders Section Starts Here */}
      {activeOrders.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No active orders found.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {activeOrders.map((order) => (
            <div
              key={order._id}
              className="border border-gray-200 p-6 rounded-2xl w-full sm:w-[350px] shadow-lg bg-white transition-all duration-200 hover:shadow-xl"
            >
              <p className="mb-1"><span className="font-semibold text-gray-700">Order ID:</span> {order._id}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Total:</span> ₹{order.totalAmount}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Address:</span> {order.address}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Payment:</span> {order.paymentMode}</p>
              <p className="mb-1"><span className="font-semibold text-gray-700">Status:</span> {order.deliveryStatus || "N/A"}</p>
              <p className="mb-2"><span className="font-semibold text-gray-700">Created At:</span> {formatDate(order.createdAt)}</p>
              <p className="font-semibold text-gray-700 mb-1">Items:</p>
              <ul className="list-disc list-inside space-y-1">
                {order.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    {item.product?.name || "Unknown"} x {item.quantity}
                    {item.product?._id && (
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        title="View Product"
                        onClick={() => handleViewProduct(item.product._id)}
                      >
                        <FaEye />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
              {order.deliveryStatus?.toLowerCase() === "pending" && (
                <button
                  onClick={() => handleDelete(order._id)}
                  className="mt-5 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md transition"
                >
                  Delete Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toggle History Button */}
      <div className="text-center mb-8">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-lg shadow-md transition"
        >
          {showHistory ? "Hide History" : "See History"}
        </button>
      </div>

      {/* Order History Section Starts Here */}
      {showHistory && (
        <div className="mt-10">
          <h3 className="text-3xl font-semibold text-gray-800 mb-6 text-center">Order History (Delivered / Cancelled)</h3>
          {historyOrders.length === 0 ? (
            <p className="text-center text-gray-600">No history available.</p>
          ) : (
            <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
              <table className="min-w-full table-auto">
                <thead className="bg-gray-100">
                  <tr className="text-gray-700 text-sm">
                    <th className="px-6 py-4 border">Order ID</th>
                    <th className="px-6 py-4 border">Total</th>
                    <th className="px-6 py-4 border">Status</th>
                    <th className="px-6 py-4 border">Created At</th>
                    <th className="px-6 py-4 border">Delivered At</th>
                    <th className="px-6 py-4 border">Items</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-800">
                  {historyOrders.map((order) => (
                    <tr key={order._id} className="text-center hover:bg-gray-50 transition">
                      <td className="px-4 py-3 border">{order._id}</td>
                      <td className="px-4 py-3 border">₹{order.totalAmount}</td>
                      <td className="px-4 py-3 border">{order.deliveryStatus}</td>
                      <td className="px-4 py-3 border">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 border">
                        {order.deliveryStatus.toLowerCase() === "delivered"
                          ? formatDate(order.deliveredAt)
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 border text-left">
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {item.product?.name || "Unknown"} x {item.quantity}
                              {item.product?._id && (
                                <button
                                  className="text-blue-600 hover:text-blue-800"
                                  title="View Product"
                                  onClick={() => handleViewProduct(item.product._id)}
                                >
                                  <FaEye />
                                </button>
                              )}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Cloth Details Modal Starts Here */}
      {showClothDetails && selectedClothId && (
        <ClothDetails
          clothId={selectedClothId}
          onClose={handleCloseClothDetails}
          isInWishlist={false}
          isInCart={false}
          onWishlistToggle={() => {}}
          onCartToggle={() => {}}
        />
      )}
    </div>
  );
};

export default MyOrders;
