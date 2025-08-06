import { useDispatch, useSelector } from "react-redux";
import { fetchOrdersRequest } from "../redux/orderSlice";
import { useEffect } from "react";

const MyOrders = () => {
  const dispatch = useDispatch();
const token = useSelector((state) => state.auth.token);
const orders = useSelector((state) => state.order.orders);;

useEffect(() => {
  if (token) {
    dispatch(fetchOrdersRequest({ token }));
  }
}, [dispatch, token]);


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
