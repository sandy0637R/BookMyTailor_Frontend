import React, { useEffect, useState } from "react";
import { FaHeart, FaEye, FaCartPlus, FaTrashAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getClothsRequest,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
} from "../redux/authSlice";
import ClothDetails from "./ClothDetails";

const Cloths = () => {
  const dispatch = useDispatch();
  const cloths = useSelector((state) => state.auth.cloths);
  const wishlist = useSelector((state) => state.auth.wishlist);
  const cart = useSelector((state) => state.auth.cart);
  const loading = useSelector((state) => state.auth.loading);

  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(getClothsRequest());
  }, [dispatch]);

  const isInWishlist = (id) => wishlist.includes(id);
  const isInCart = (id) => cart.some((entry) => entry.item === id);
  const getCartQuantity = (id) =>
    cart.find((entry) => entry.item === id)?.quantity || 0;

  const handleCartToggle = (id, action) => {
    if (action === "add") {
      dispatch(addToCart(id));
    } else if (action === "remove") {
      const existing = cart.find((entry) => entry.item === id);
      if (existing?.quantity > 1) {
        dispatch(removeFromCart(id)); // Decrease quantity
      } else {
        dispatch(removeFromCart(id)); // Remove completely
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Available Clothes</h2>

      {loading ? (
        <p className="text-center text-lg font-medium">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cloths.map((cloth) => {
            const showDetails = expandedId === cloth._id;
            const inCart = isInCart(cloth._id);
            const quantity = getCartQuantity(cloth._id);

            return (
              <div
                key={cloth._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={
                    cloth.image?.startsWith("/uploads")
                      ? `http://localhost:5000${cloth.image}`
                      : cloth.image || "/placeholder.jpg"
                  }
                  alt={cloth.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold">{cloth.name}</h3>
                  {cloth.tailor?.name && (
                    <p className="text-sm text-gray-500">
                      Manufacturer: {cloth.tailor.name}
                    </p>
                  )}
                  <p className="text-lg font-bold text-green-600">
                    ₹{cloth.price}
                  </p>

                  <div className="flex justify-between mt-2 flex-wrap gap-2">
                    {!inCart &&
                      (isInWishlist(cloth._id) ? (
                        <button
                          onClick={() =>
                            dispatch(removeFromWishlist(cloth._id))
                          }
                          className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
                        >
                          <FaTrashAlt /> Remove Wishlist
                        </button>
                      ) : (
                        <button
                          onClick={() => dispatch(addToWishlist(cloth._id))}
                          className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-gray-600 hover:text-red-500 hover:border-red-500 transition"
                        >
                          <FaHeart /> Wishlist
                        </button>
                      ))}

                    <button
                      onClick={() =>
                        setExpandedId((prev) =>
                          prev === cloth._id ? null : cloth._id
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <FaEye /> {showDetails ? "Hide" : "View"}
                    </button>

                    {inCart ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleCartToggle(cloth._id, "remove")
                          }
                          className="px-2 py-1 text-lg font-bold border rounded hover:bg-red-100"
                        >
                          -
                        </button>
                        <span className="text-lg">{quantity}</span>
                        <button
                          onClick={() => handleCartToggle(cloth._id, "add")}
                          className="px-2 py-1 text-lg font-bold border rounded hover:bg-green-100"
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => dispatch(addToCart(cloth._id))}
                        className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-green-600 hover:bg-green-600 hover:text-white transition"
                      >
                        <FaCartPlus /> Add to Cart
                      </button>
                    )}
                  </div>

                  {showDetails && (
                    <ClothDetails
                      cloth={cloth}
                      onClose={() => setExpandedId(null)}
                      isInWishlist={isInWishlist(cloth._id)}
                      isInCart={isInCart(cloth._id)}
                      onWishlistToggle={(id) =>
                        isInWishlist(id)
                          ? dispatch(removeFromWishlist(id))
                          : dispatch(addToWishlist(id))
                      }
                      onCartToggle={handleCartToggle}
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Cloths;
