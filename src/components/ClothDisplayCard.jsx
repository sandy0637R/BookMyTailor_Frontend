import React from "react";
import { FaHeart, FaEye, FaCartPlus, FaTrashAlt } from "react-icons/fa";
import ClothDetails from "./ClothDetails";

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
    <>
      <div className="bg-neutral-primary rounded-2xl shadow-common hover-common transition duration-300 group border border-brown-primary/10 flex flex-col justify-between h-full">
        
        {/* IMAGE */}
        <div className="relative overflow-hidden aspect-square w-full rounded-t-2xl">
          <img
            src={
              cloth.image?.startsWith("/uploads")
                ? `https://bookmytailor-backend.onrender.com${cloth.image}`
                : cloth.image || "/placeholder.jpg"
            }
            alt={cloth.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />

          <div className="absolute top-3 right-3 bg-brown-tertiary/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-yellow-tertiary border border-yellow-tertiary/20">
            ₹{cloth.price}
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
          
          {/* TITLE */}
          <div>
            <h3 className="text-lg font-bold text-brown-secondary tracking-wide line-clamp-1">
              {cloth.name}
            </h3>

            {cloth.tailor?.name && (
              <p className="text-xs font-medium text-brown-primary/70 mt-1">
                Designer:{" "}
                <span className="text-brown-primary font-semibold">
                  {cloth.tailor.name}
                </span>
              </p>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex justify-between items-center gap-2 pt-2 border-t border-brown-primary/10">
            
            {/* WISHLIST */}
            {!isInCart &&
              (isInWishlist ? (
                <button
                  onClick={() => onWishlistToggle(cloth._id)}
                  className="flex items-center justify-center gap-1.5 cloth-card-btn bg-danger-primary hover:bg-danger-secondary text-neutral-primary transition-all duration-200"
                >
                  <FaTrashAlt size={13} />
                  Remove
                </button>
              ) : (
                <button
                  onClick={() => onWishlistToggle(cloth._id)}
                  className="flex items-center justify-center gap-1.5 cloth-card-btn bg-brown-secondary hover:bg-brown-primary text-neutral-primary transition-all duration-200"
                >
                  <FaHeart size={13} />
                  Wishlist
                </button>
              ))}

            {/* VIEW BUTTON */}
            <button
              onClick={() =>
                setExpandedId((prev) =>
                  prev === cloth._id ? null : cloth._id
                )
              }
              className="flex items-center justify-center gap-1.5 cloth-card-btn bg-brown-primary hover:bg-brown-secondary text-neutral-primary transition-all duration-200"
            >
              <FaEye size={13} />
              {showDetails ? "Hide" : "View"}
            </button>

            {/* CART */}
            {isInCart ? (
              <div className="flex items-center gap-2 bg-yellow-primary/50 px-2 py-1 rounded-lg border border-yellow-tertiary/20">
                <button
                  onClick={() => handleCartToggle(cloth._id, "remove")}
                  className="w-7 h-7 flex items-center justify-center text-sm font-bold rounded bg-brown-secondary text-neutral-primary hover:bg-brown-primary transition"
                >
                  -
                </button>

                <span className="text-sm font-bold text-brown-secondary">
                  {quantity}
                </span>

                <button
                  onClick={() => handleCartToggle(cloth._id, "add")}
                  className="w-7 h-7 flex items-center justify-center text-sm font-bold rounded bg-brown-secondary text-neutral-primary hover:bg-brown-primary transition"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleCartToggle(cloth._id, "add")}
                className="flex items-center justify-center gap-1.5 cloth-card-btn bg-yellow-tertiary hover:bg-yellow-secondary text-brown-tertiary transition-all duration-200"
              >
                <FaCartPlus size={13} />
                Cart
              </button>
            )}
          </div>
        </div>
      </div>

      {/* DETAILS OUTSIDE CARD */}
      {showDetails && (
        <div className="mt-4">
          <ClothDetails
            cloth={cloth}
            onClose={() => setExpandedId(null)}
            isInWishlist={isInWishlist}
            isInCart={isInCart}
            onWishlistToggle={onWishlistToggle}
            onCartToggle={onCartToggle}
          />
        </div>
      )}
    </>
  );
};

export default React.memo(ClothDisplayCard);