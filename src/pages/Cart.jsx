import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaEye } from "react-icons/fa";
import {
  removeFromCart,
  addToWishlist,
  fetchProfileRequest,
  getClothsRequest,
  addToCart,
  updateProfileRequest,
} from "../redux/authSlice";
import { placeOrderRequest } from "../redux/orderSlice";
import ClothDetails from "../components/ClothDetails";

const Cart = () => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);

  const cart = useSelector((state) => state.auth.cart);
  const cloths = useSelector((state) => state.auth.cloths);
  const token = useSelector((state) => state.auth.token);
  const profile = useSelector((state) => state.auth.profile);
  const [expandedId, setExpandedId] = useState(null);
  const [address, setAddress] = useState("");
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [paymentMode, setPaymentMode] = useState("");
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showOrderSummary, setShowOrderSummary] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(fetchProfileRequest());
    }
    dispatch(getClothsRequest());
  }, [dispatch, token]);

  useEffect(() => {
    if (profile?.address) {
      setAddress(profile.address);
      setIsEditingAddress(false);
    }
  }, [profile]);

  const cartItems = useMemo(
    () =>
      cart
        ?.map(({ item, quantity }) => {
          const cloth = cloths.find((c) => c._id === item);
          return cloth ? { ...cloth, quantity } : null;
        })
        .filter(Boolean),
    [cart, cloths]
  );

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = () => {
  if (!address || !paymentMode) return;

  const items = cartItems.map((item) => ({
    product: item._id,
    quantity: item.quantity,
  }));

  const orderData = {
    items,
    address,
    paymentMode,
    totalAmount: totalPrice,
  };

  dispatch(
    placeOrderRequest({
      token,
      orderData,
      userId: profile._id,
      navigate,
    })
  );
};

 

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Your Cart</h2>

      {cartItems.length === 0 || orderPlaced ? (
        <p className="text-center text-lg text-gray-600">
          {orderPlaced ? "Your order has been placed!" : "Cart is empty."}
        </p>
      ) : (
        <>
          {/* Cart Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold">{item.name}</h3>
                  <p className="text-gray-600">
                    Brand: <span className="text-black">{item.manufacturer}</span>
                  </p>
                  <p className="text-lg font-bold text-green-600">₹{item.price}</p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="px-2 py-1 text-lg font-bold border rounded hover:bg-red-100"
                    >
                      -
                    </button>
                    <span className="text-lg">{item.quantity}</span>
                    <button
                      onClick={() => dispatch(addToCart(item._id))}
                      className="px-2 py-1 text-lg font-bold border rounded hover:bg-green-100"
                    >
                      +
                    </button>
                  </div>
                  <div className="flex justify-between mt-4 flex-wrap gap-2">
                    <button
                      onClick={() => dispatch(removeFromCart(item._id))}
                      className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
                    >
                      <FaTrash /> Remove
                    </button>
                    <button
                      onClick={() => setExpandedId(item._id)}
                      className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <FaEye /> View
                    </button>
                  </div>
                </div>

                {expandedId === item._id && (
                  <ClothDetails
                    cloth={item}
                    isInCart={true}
                    isInWishlist={false}
                    onClose={() => setExpandedId(null)}
                    onCartToggle={() => {
                      dispatch(removeFromCart(item._id));
                      setExpandedId(null);
                    }}
                    onWishlistToggle={() => {
                      dispatch(removeFromCart(item._id));
                      dispatch(addToWishlist(item._id));
                      setExpandedId(null);
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Buy Now Button */}
          {!showOrderSummary && (
            <div className="mt-10 max-w-2xl mx-auto text-center">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
                onClick={() => setShowOrderSummary(true)}
              >
                Buy Now
              </button>
            </div>
          )}

          {/* Order Summary */}
          {showOrderSummary && (
            <div className="mt-10 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-4">Order Summary</h3>

              <ul className="divide-y">
                {cartItems.map((item) => (
                  <li key={item._id} className="flex justify-between py-2">
                    <span>
                      {item.name} x{item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </li>
                ))}
              </ul>

              <div className="text-right font-bold text-xl mt-4">
                Total: ₹{totalPrice}
              </div>

              {/* Payment Mode */}
              <div className="mt-6">
                <label className="block font-medium mb-2">
                  Select Payment Mode:
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMode === "cod"}
                    onChange={() => setPaymentMode("cod")}
                  />
                  Cash on Delivery
                </label>
              </div>

              {/* Address Section */}
              <div className="mt-6">
                <label className="block font-medium mb-2">Delivery Address:</label>

                {isEditingAddress ? (
                  <>
                    <textarea
                      className="w-full border p-2 rounded"
                      rows={3}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        dispatch(updateProfileRequest({ address }));
                        dispatch(fetchProfileRequest()); // ← ensures Redux stays updated
                        setIsEditingAddress(false);
                      }}
                      className="mt-2 px-4 py-1 border rounded bg-green-600 text-white"
                    >
                      Save Address
                    </button>
                  </>
                ) : (
                  <div className="flex justify-between items-start">
                    <p>{address || "No address saved."}</p>
                    <button
                      onClick={() => setIsEditingAddress(true)}
                      className="text-blue-600 underline"
                    >
                      Change Address
                    </button>
                  </div>
                )}
              </div>

              {/* Place Order */}
              <button
                className={`mt-6 w-full py-2 rounded text-white font-bold ${
                  address && paymentMode
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={!address || !paymentMode}
                onClick={handlePlaceOrder}
              >
                Place Order
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Cart;
