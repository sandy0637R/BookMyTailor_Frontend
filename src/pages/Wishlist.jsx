import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash, FaEye, FaCartPlus } from "react-icons/fa";
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
        <p className="text-center text-lg text-gray-600">
          No items in wishlist.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistItems.map((item) => {
            const showDetails = expandedId === item._id;
            const inCart = isInCart(item._id);

            return (
              <div
                key={item._id}
                className="bg-neutral-primary rounded-2xl shadow-common overflow-hidden hover-common transition duration-300"
              >
                <img
                  src={
                    item.image?.startsWith("/uploads")
                      ? `http://localhost:5000${item.image}`
                      : item.image || "/placeholder.jpg"
                  }
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />

                <div className="p-4 space-y-2">
                  <h3 className="text-xl font-semibold text-brown-secondary">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Manufacturer: {item.manufacturer}
                  </p>
                  <p className="text-lg font-bold text-yellow-tertiary">
                    ₹{item.price}
                  </p>

                  <div className="flex flex-col ">
                    <div className="flex items-center">
                      <button
                        onClick={() => {
                          dispatch(removeFromWishlist(item._id));
                          setExpandedId(null);
                        }}
                        className="cloth-detail-btn   bg-danger-primary hover:bg-danger-secondary hover-common mr-3"
                      >
                        <span className="mr-2">
                          {" "}
                          <FaTrash />
                        </span>{" "}
                        Remove
                      </button>

                      <button
                        onClick={() =>
                          setExpandedId(showDetails ? null : item._id)
                        }
                        className="cloth-detail-btn hover-common bg-brown-primary hover:bg-brown-secondary"
                      >
                        <span className="mr-2">
                          {" "}
                          <FaEye />
                        </span>{" "}
                        {showDetails ? "Hide" : "View"}
                      </button>
                    </div>
                    {!inCart && (
                      <button
                        onClick={() => {
                          dispatch(addToCart(item._id));
                          dispatch(removeFromWishlist(item._id));
                          setExpandedId(null);
                        }}
                        className="flex justify-center items-center py-2 w-[100%] text-neutral-primary rounded-sm mt-3 bg-brown-secondary hover-common hover:bg-brown-primary"
                      >
                        <span className="mr-2">
                          <FaCartPlus />
                        </span>{" "}
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>

                {showDetails && (
                  <ClothDetails
                    cloth={item}
                    isInCart={inCart}
                    isInWishlist={true}
                    onClose={() => setExpandedId(null)}
                    onWishlistToggle={() => {
                      dispatch(removeFromWishlist(item._id));
                      setExpandedId(null);
                    }}
                    onCartToggle={() => {
                      dispatch(addToCart(item._id));
                      dispatch(removeFromWishlist(item._id));
                      setExpandedId(null);
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
