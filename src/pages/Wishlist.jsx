import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaTrash } from "react-icons/fa";
import { removeFromWishlist, addToCart } from "../redux/authSlice";

const Wishlist = () => {
  const wishlist = useSelector((state) => state.auth.wishlist);
  const dispatch = useDispatch();

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Your Wishlist</h2>

      {wishlist.length === 0 ? (
        <p className="text-center text-lg text-gray-600">No items in wishlist.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
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

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => dispatch(removeFromWishlist(item._id))}
                    className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
                  >
                    <FaTrash /> Remove
                  </button>
                  <button
                    onClick={() => dispatch(addToCart(item))}
                    className="px-3 py-1 border rounded-xl text-sm text-green-600 hover:bg-green-600 hover:text-white transition"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
