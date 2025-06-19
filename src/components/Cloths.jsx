import React, { useEffect, useState } from "react";
import {
  FaHeart,
  FaEye,
  FaCartPlus,
  FaTrashAlt,
} from "react-icons/fa";
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
  const isInCart = (id) => cart.includes(id);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Available Clothes</h2>

      {loading ? (
        <p className="text-center text-lg font-medium">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cloths.map((cloth) => {
            const showDetails = expandedId === cloth._id;

            return (
              <div
                key={cloth._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
              >
                <img
                  src={cloth.image}
                  alt={cloth.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold">{cloth.name}</h3>
                  <p className="text-lg font-bold text-green-600">
                    ₹{cloth.price}
                  </p>

                  <div className="flex justify-between mt-2">
                    {!isInCart(cloth._id) && (
                      isInWishlist(cloth._id) ? (
                        <button
                          onClick={() => dispatch(removeFromWishlist(cloth._id))}
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
                      )
                    )}

                    <button
                      onClick={() =>
                        setExpandedId((prev) => (prev === cloth._id ? null : cloth._id))
                      }
                      className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-blue-600 hover:bg-blue-600 hover:text-white transition"
                    >
                      <FaEye /> {showDetails ? "Hide" : "View"}
                    </button>

                    {isInCart(cloth._id) ? (
                      <button
                        onClick={() => dispatch(removeFromCart(cloth._id))}
                        className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
                      >
                        <FaTrashAlt /> Remove Cart
                      </button>
                    ) : (
                      <button
                        onClick={() => dispatch(addToCart(cloth._id))}
                        className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-green-600 hover:bg-green-600 hover:text-white transition"
                      >
                        <FaCartPlus /> Add to Cart
                      </button>
                    )}
                  </div>

                  {showDetails && <ClothDetails
    cloth={cloths.find((c) => c._id === expandedId)}
    onClose={() => setExpandedId(null)}
    isInWishlist={isInWishlist(expandedId)}
    isInCart={isInCart(expandedId)}
    onWishlistToggle={(id) =>
      isInWishlist(id)
        ? dispatch(removeFromWishlist(id))
        : dispatch(addToWishlist(id))
    }
    onCartToggle={(id) =>
      isInCart(id)
        ? dispatch(removeFromCart(id))
        : dispatch(addToCart(id))
    }
  />}
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
