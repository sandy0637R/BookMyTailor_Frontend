import React, { useEffect } from "react";
import { FaHeart, FaEye, FaCartPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  getClothsRequest,
  addToWishlist,
  addToCart,
} from "../redux/authSlice"; // ✅ adjust path if needed

const Cloths = () => {
  const dispatch = useDispatch();
  const cloths = useSelector((state) => state.auth.cloths);
  const loading = useSelector((state) => state.auth.loading);

  useEffect(() => {
    dispatch(getClothsRequest()); // ✅ fetch all cloths from backend
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h2 className="text-3xl font-bold text-center mb-8">Available Clothes</h2>

      {loading ? (
        <p className="text-center text-lg font-medium">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {cloths.map((cloth) => (
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
                <p className="text-gray-600">
                  Type: <span className="text-black">{cloth.type}</span>
                </p>
                <p className="text-gray-600">
                  Brand:{" "}
                  <span className="text-black">{cloth.manufacturer}</span>
                </p>
                <p className="text-gray-600">
                  Size:{" "}
                  <span className="text-black">{cloth.size.join(", ")}</span>
                </p>
                <p className="text-gray-600">
                  Gender: <span className="text-black">{cloth.gender}</span>
                </p>
                <p className="text-lg font-bold text-green-600">
                  ₹{cloth.price}
                </p>

                <div className="flex justify-between mt-4">
                  <button
                    onClick={() => dispatch(addToWishlist(cloth))}
                    className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-gray-600 hover:text-red-500 hover:border-red-500 transition"
                  >
                    <FaHeart /> Wishlist
                  </button>

                  <button className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-blue-600 hover:bg-blue-600 hover:text-white transition">
                    <FaEye /> View
                  </button>

                  <button
                    onClick={() => dispatch(addToCart(cloth))}
                    className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-green-600 hover:bg-green-600 hover:text-white transition"
                  >
                    <FaCartPlus /> Add to Cart
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

export default Cloths;
