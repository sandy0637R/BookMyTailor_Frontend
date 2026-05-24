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
    <div className="bg-neutral-primary rounded-2xl shadow-common overflow-hidden hover-common transition duration-300">
      <img
        src={
          cloth.image?.startsWith("/uploads")
            ? `https://bookmytailor-backend.onrender.com${cloth.image}`
            : cloth.image || "/placeholder.jpg"
        }
        alt={cloth.name}
        className="w-full h-64 object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-xl font-semibold text-brown-secondary">{cloth.name}</h3>
        {cloth.tailor?.name && (
          <p className="text-sm text-gray-500">
            Manufacturer: {cloth.tailor.name}
          </p>
        )}
        <p className="text-lg font-bold text-yellow-tertiary">₹{cloth.price}</p>

        <div className="flex justify-between mt-2  gap-2">
          {!isInCart &&
            (isInWishlist ? (
              <button
                onClick={() => onWishlistToggle(cloth._id)}
                className="flex items-center gap-2 cloth-card-btn hover-common text-sm text-neutral-primary bg-danger-primary hover:bg-danger-secondary  transition "
              >
                <FaTrashAlt /> Remove
              </button>
            ) : (
              <button
                onClick={() => onWishlistToggle(cloth._id)}
                className="flex items-center gap-2 cloth-card-btn hover-common bg-brown-secondary hover:bg-brown-primary hover:!text-red-100"
              >
                <FaHeart /> Wishlist
              </button>
            ))}

          <button
            onClick={() =>
              setExpandedId((prev) => (prev === cloth._id ? null : cloth._id))
            }
            className="flex items-center gap-2 cloth-card-btn hover-common bg-brown-primary hover:bg-brown-secondary"
          >
            <FaEye /> {showDetails ? "Hide" : "View"}
          </button>

          {isInCart ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCartToggle(cloth._id, "remove")}
                className="px-2 py-1 text-lg font-bold rounded bg-brown-secondary text-neutral-primary hover:bg-brown-primary hover-common "
              >
                -
              </button>
              <span className="text-lg text-brown-primary">{quantity}</span>
              <button
                onClick={() => handleCartToggle(cloth._id, "add")}
                className="px-2 py-1 text-lg font-bol rounded bg-brown-secondary text-neutral-primary hover:bg-brown-primary hover-common "
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() => handleCartToggle(cloth._id, "add")}
              className="flex items-center gap-2 cloth-card-btn hover-common bg-brown-secondary hover:bg-brown-primary"
            >
              <FaCartPlus /> Cart
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
