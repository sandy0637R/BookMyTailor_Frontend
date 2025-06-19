import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaEye } from "react-icons/fa";
import {
  removeFromCart,
  addToWishlist,
  fetchProfileRequest,
  getClothsRequest,
} from "../redux/authSlice";
import ClothDetails from "../components/ClothDetails";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.auth.cart);
  const cloths = useSelector((state) => state.auth.cloths);
  const token = useSelector((state) => state.auth.token);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfileRequest());
    }
    dispatch(getClothsRequest());
  }, [dispatch, token]);

  const cartItems = useMemo(
    () =>
      cart
        ?.map((id) => cloths.find((item) => item._id === id))
        .filter(Boolean),
    [cart, cloths]
  );

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);
  const isInCart = (id) => cart.includes(id);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Your Cart</h2>

      {cartItems.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Cart is empty.</p>
      ) : (
        <>
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
                    Brand:{" "}
                    <span className="text-black">{item.manufacturer}</span>
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    ₹{item.price}
                  </p>

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

          <div className="mt-8 text-center text-xl font-bold">
            Total: ₹{totalPrice}
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
