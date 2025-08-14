import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getClothsRequest,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
} from "../redux/authSlice";
import ClothDisplayCard from "../components/ClothDisplayCard";

const Cloths = () => {
  const dispatch = useDispatch();
  const cloths = useSelector((state) => state.auth.cloths);
  const wishlist = useSelector((state) => state.auth.wishlist);
  const cart = useSelector((state) => state.auth.cart);
  const loading = useSelector((state) => state.auth.loading);

  const [expandedId, setExpandedId] = useState(null);

  // Pagination
  const [startIndex, setStartIndex] = useState(0);
  const itemsPerPage = 4;

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
    } else {
      dispatch(removeFromCart(id));
    }
  };

  const nextPage = () => {
    if (startIndex + itemsPerPage < cloths.length) setStartIndex(startIndex + itemsPerPage);
  };

  const prevPage = () => {
    if (startIndex - itemsPerPage >= 0) setStartIndex(startIndex - itemsPerPage);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Available Clothes</h2>

      {loading ? (
        <p className="text-center text-lg font-medium">Loading...</p>
      ) : (
        <div className="relative">
          <button
            onClick={prevPage}
            disabled={startIndex === 0}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
          >
            ◀
          </button>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-12">
            {cloths.slice(startIndex, startIndex + itemsPerPage).map((cloth) => (
              <ClothDisplayCard
                key={cloth._id}
                cloth={cloth}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                isInWishlist={isInWishlist(cloth._id)}
                isInCart={isInCart(cloth._id)}
                quantity={getCartQuantity(cloth._id)}
                handleCartToggle={handleCartToggle}
                onWishlistToggle={(id) =>
                  isInWishlist(id)
                    ? dispatch(removeFromWishlist(id))
                    : dispatch(addToWishlist(id))
                }
                onCartToggle={handleCartToggle}
              />
            ))}
          </div>

          <button
            onClick={nextPage}
            disabled={startIndex + itemsPerPage >= cloths.length}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 rounded-full p-3 shadow hover:bg-gray-300 disabled:opacity-50 z-10"
          >
            ▶
          </button>
        </div>
      )}
    </div>
  );
};

export default Cloths;
