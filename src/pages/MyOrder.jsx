import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersRequest, deleteOrderRequest } from "../redux/orderSlice";
import { useEffect, useState } from "react";
import { FaEye, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ClothDetails from "../components/ClothDetails";

const MyOrders = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orders = useSelector((state) => state.order.orders);

  const [showHistory, setShowHistory] = useState(false);
  const [showClothDetails, setShowClothDetails] = useState(false);
  const [selectedClothId, setSelectedClothId] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0); // Always start from top
    if (token) dispatch(fetchOrdersRequest({ token }));
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );
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
    <div className="p-6 md:p-10 bg-neutral-primary min-h-screen">
      <h2 className="text-4xl font-bold mb-10 text-center text-brown-primary tracking-tight border-b-4 border-brown-primary pb-4">
        My Orders
      </h2>

      {/* Active Orders Section */}
      {activeOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 gap-6">
          <p className="text-2xl text-brown-primary font-semibold text-center">
            You have no active orders 😢
          </p>
          <p className="text-yellow-tertiary font-medium text-center">
            Explore our collection and place your first order.
          </p>
          <Link
            to="/"
            className="flex items-center gap-2 bg-yellow-tertiary hover:bg-yellow-primary text-brown-secondary font-bold py-3 px-6 rounded transition"
          >
            <FaSearch /> Explore
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {activeOrders.map((order) => (
            <div
              key={order._id}
              className="bg-neutral-primary border border-brown-secondary p-6 rounded-2xl w-full sm:w-[350px] shadow-lg hover:shadow-xl transition duration-300"
            >
              <p className="mb-1">
                <span className="font-semibold text-brown-primary">
                  Order ID:
                </span>{" "}
                {order._id}
              </p>
              <p className="mb-1">
                <span className="font-semibold text-brown-primary">Total:</span>{" "}
                ₹{order.totalAmount}
              </p>
              <p className="mb-1">
                <span className="font-semibold text-brown-primary">
                  Address:
                </span>
                <div className="max-h-16 overflow-y-auto mt-1 p-1 border border-brown-secondary rounded bg-yellow-primary text-brown-primary">
                  {order.address}
                </div>
              </p>

              <p className="mb-1">
                <span className="font-semibold text-brown-primary">
                  Payment:
                </span>{" "}
                {order.paymentMode}
              </p>
              <p className="mb-1">
                <span className="font-semibold text-brown-primary">
                  Status:
                </span>{" "}
                {order.deliveryStatus || "N/A"}
              </p>
              <p className="mb-2">
                <span className="font-semibold text-brown-primary">
                  Created At:
                </span>{" "}
                {formatDate(order.createdAt)}
              </p>
              <p className="font-semibold text-brown-primary mb-1">Items:</p>
              <ul className="list-disc list-inside space-y-1 h-[100px] border-2 border-brown-primary rounded-xl p-4 overflow-y-auto">
                {order.items.map((item, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-2 text-brown-primary text-sm"
                  >
                    {item.product?.name || "Unknown"} x {item.quantity}
                    {item.product?._id && (
                      <button
                        className="text-yellow-tertiary hover:text-yellow-primary"
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
                  className="mt-5 w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
                >
                  Delete Order
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Toggle History Button */}
      <div className="text-center mb-8 mt-10">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="bg-brown-primary hover:bg-brown-secondary text-yellow-tertiary px-6 py-2 rounded-lg text-lg shadow-md transition"
        >
          {showHistory ? "Hide History" : "See History"}
        </button>
      </div>

      {/* Order History Section */}
      {showHistory && (
        <div className="mt-10">
          <h3 className="text-3xl font-semibold text-brown-primary mb-6 text-center">
            Order History
          </h3>
          {historyOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-4">
              <p className="text-brown-primary text-lg font-medium">
                No order history available.
              </p>
              <Link
                to="/"
                className="flex items-center gap-2 bg-yellow-tertiary hover:bg-yellow-primary text-brown-secondary font-bold py-3 px-6 rounded transition"
              >
                <FaSearch /> Explore
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto bg-neutral-primary rounded-xl shadow-md border border-brown-secondary">
              <table className="min-w-full table-auto">
                <thead className="bg-brown-primary text-yellow-tertiary">
                  <tr>
                    <th className="px-6 py-4 border">Order ID</th>
                    <th className="px-6 py-4 border">Total</th>
                    <th className="px-6 py-4 border">Status</th>
                    <th className="px-6 py-4 border">Created At</th>
                    <th className="px-6 py-4 border">Delivered At</th>
                    <th className="px-6 py-4 border">Items</th>
                  </tr>
                </thead>
                <tbody className="text-brown-primary text-sm">
                  {historyOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="text-center hover:bg-yellow-tertiary transition"
                    >
                      <td className="px-4 py-3 border">{order._id}</td>
                      <td className="px-4 py-3 border">₹{order.totalAmount}</td>
                      <td className="px-4 py-3 border">
                        {order.deliveryStatus}
                      </td>
                      <td className="px-4 py-3 border">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 border">
                        {order.deliveryStatus.toLowerCase() === "delivered"
                          ? formatDate(order.deliveredAt)
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 border text-left">
                        <ul className="list-disc list-inside space-y-1">
                          {order.items.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              {item.product?.name || "Unknown"} x{" "}
                              {item.quantity}
                              {item.product?._id && (
                                <button
                                  className="text-yellow-tertiary hover:text-yellow-primary"
                                  title="View Product"
                                  onClick={() =>
                                    handleViewProduct(item.product._id)
                                  }
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

      {/* Cloth Details Modal */}
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
