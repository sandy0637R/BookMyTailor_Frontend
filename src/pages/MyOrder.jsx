import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersRequest } from "../redux/orderSlice";
import { useEffect, useState } from "react";

const MyOrders = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.auth.token);
  const orders = useSelector((state) => state.order.orders);
  const [showHistory, setShowHistory] = useState(false);

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

  return (
    <div>
      <h2>My Orders</h2>

      {activeOrders.length === 0 ? (
        <p>No active orders found.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", marginBottom: "30px" }}>
          {activeOrders.map((order) => (
            <div
              key={order._id}
              style={{
                border: "1px solid #ccc",
                padding: "20px",
                borderRadius: "10px",
                width: "300px",
                boxShadow: "2px 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Address:</strong> {order.address}</p>
              <p><strong>Payment:</strong> {order.paymentMode}</p>
              <p><strong>Status:</strong> {order.deliveryStatus || "N/A"}</p>
              <strong>Items:</strong>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.product?.name || "Unknown"} x {item.quantity}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => setShowHistory(!showHistory)} style={{ marginBottom: "20px" }}>
        {showHistory ? "Hide History" : "See History"}
      </button>

      {showHistory && (
        <div style={{ marginTop: "30px" }}>
          <h3>Order History (Delivered / Cancelled)</h3>
          {historyOrders.length === 0 ? (
            <p>No history available.</p>
          ) : (
            <table border="1" cellPadding="10" cellSpacing="0" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Items</th>
                </tr>
              </thead>
              <tbody>
                {historyOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>₹{order.totalAmount}</td>
                    <td>{order.deliveryStatus}</td>
                    <td>
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.product?.name || "Unknown"} x {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
