import React from "react";
import { FaHeart, FaEye, FaCartPlus, FaTrashAlt } from "react-icons/fa";
import ClothDetails from "./ClothDetails"; // 👈 import properly

const ClothDisplayCard = ({
  cloth,
  expandedId,
  setExpandedId,
  isInWishlist,
  isInCart,
  quantity,
  handleCartToggle,
  onWishlistToggle,
  onCartToggle,
}) => {
  const showDetails = expandedId === cloth._id;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300">
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
        <p className="text-lg font-bold text-green-600">₹{cloth.price}</p>

        <div className="flex justify-between mt-2 flex-wrap gap-2">
          {!isInCart &&
            (isInWishlist ? (
              <button
                onClick={() => onWishlistToggle(cloth._id)}
                className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                <FaTrashAlt /> Remove Wishlist
              </button>
            ) : (
              <button
                onClick={() => onWishlistToggle(cloth._id)}
                className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-gray-600 hover:text-red-500 hover:border-red-500 transition"
              >
                <FaHeart /> Wishlist
              </button>
            ))}

          <button
            onClick={() =>
              setExpandedId((prev) => (prev === cloth._id ? null : cloth._id))
            }
            className="flex items-center gap-2 px-3 py-1 border rounded-xl text-sm text-blue-600 hover:bg-blue-600 hover:text-white transition"
          >
            <FaEye /> {showDetails ? "Hide" : "View"}
          </button>

          {isInCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCartToggle(cloth._id, "remove")}
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
              onClick={() => handleCartToggle(cloth._id, "add")}
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
            isInWishlist={isInWishlist}
            isInCart={isInCart}
            onWishlistToggle={onWishlistToggle}
            onCartToggle={onCartToggle}
          />
        )}
      </div>
    </div>
  );
};

export default ClothDisplayCard;
