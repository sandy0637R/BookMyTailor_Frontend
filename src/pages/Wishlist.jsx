import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaEye } from "react-icons/fa";
import {
  removeFromWishlist,
  addToCart,
  fetchProfileRequest,
  getClothsRequest,
} from "../redux/authSlice";
import ClothDetails from "../components/ClothDetails";

const Wishlist = () => {
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.auth.wishlist);
  const cloths = useSelector((state) => state.auth.cloths);
  const cart = useSelector((state) => state.auth.cart);
  const token = useSelector((state) => state.auth.token);
  const [expandedId, setExpandedId] = useState(null);

  // ✅ Fetch on refresh
  useEffect(() => {
    if (token) {
      dispatch(fetchProfileRequest());
    }
    dispatch(getClothsRequest());
  }, [dispatch, token]);

  // ✅ Filter out wishlist items already in cart
  const wishlistItems = useMemo(
    () =>
      wishlist
        ?.filter((id) => !cart.includes(id))
        .map((id) => cloths.find((item) => item._id === id))
        .filter(Boolean),
    [wishlist, cart, cloths]
  );

  const isInCart = (id) => cart.includes(id);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Your Wishlist</h2>

      {!wishlistItems || wishlistItems.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => (
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

                <div className="flex justify-between mt-4 flex-wrap gap-2">
                  <button
                    onClick={() => {
                      dispatch(removeFromWishlist(item._id));
                      setExpandedId(null); // ✅ Close popup if open
                    }}
                    className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    <FaTrash /> Remove
                  </button>

                  <button
                    onClick={() => {
                      dispatch(addToCart(item._id));
                      dispatch(removeFromWishlist(item._id));
                      setExpandedId(null); // ✅ Close popup if open
                    }}
                    className="px-3 py-1 border rounded-xl text-sm text-green-600 hover:bg-green-600 hover:text-white transition"
                  >
                    Add to Cart
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
                  isInCart={isInCart(item._id)}
                  isInWishlist={true}
                  onClose={() => setExpandedId(null)}
                  onWishlistToggle={() => {
                    dispatch(removeFromWishlist(item._id));
                    setExpandedId(null); // ✅ Close popup
                  }}
                  onCartToggle={() => {
                    dispatch(addToCart(item._id));
                    dispatch(removeFromWishlist(item._id));
                    setExpandedId(null); // ✅ Close popup
                  }}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
