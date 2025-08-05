import React, { useEffect, useState } from "react";
import axios from "axios";

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const token = localStorage.getItem("token");

useEffect(() => {
  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/orders/my", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  fetchOrders();
}, []);


  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order._id} style={{ marginBottom: "20px" }}>
              <strong>Order ID:</strong> {order._id} <br />
              <strong>Total:</strong> ₹{order.totalAmount} <br />
              <strong>Address:</strong> {order.address} <br />
              <strong>Payment:</strong> {order.paymentMode} <br />
              <strong>Items:</strong>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    Product: {item.product?.name || "Unknown"} | Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyOrders;
