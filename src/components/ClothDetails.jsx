import React from "react";
import { FaHeart, FaTrashAlt, FaCartPlus, FaArrowLeft, FaLink } from "react-icons/fa";
import { toast } from "react-hot-toast";


const ClothDetails = ({
  cloth,
  onClose,
  isInWishlist,
  isInCart,
  onWishlistToggle,
  onCartToggle,
}) => {
  if (!cloth) return null;

  const handleCopyLink = () => {
    const link = `${window.location.origin}/cloths/${cloth._id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className="w-[90%] md:w-[70%] h-[80%] bg-white rounded-2xl shadow-2xl flex overflow-hidden transition-all duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left - Image */}
        <div className="w-1/2 bg-gray-100">
          <img
            src={cloth.image}
            alt={cloth.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Details */}
        <div className="w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{cloth.name}</h2>
            <p className="text-gray-600 mb-1"><strong>Type:</strong> {cloth.type}</p>
            <p className="text-gray-600 mb-1"><strong>Brand:</strong> {cloth.manufacturer}</p>
            <p className="text-gray-600 mb-1"><strong>Sizes:</strong> {cloth.size.join(", ")}</p>
            <p className="text-gray-600 mb-1"><strong>Gender:</strong> {cloth.gender}</p>
            <p className="text-xl font-bold text-green-600 mt-4">₹{cloth.price}</p>
          </div>

          <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-gray-600 hover:text-black hover:border-black"
            >
              <FaArrowLeft /> Back
            </button>

            <button
              onClick={handleCopyLink}
              className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-indigo-600 hover:bg-indigo-600 hover:text-white"
            >
              <FaLink /> Copy Link
            </button>

            {!isInCart && (
              isInWishlist ? (
                <button
                  onClick={() => onWishlistToggle(cloth._id)}
                  className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-red-600 hover:bg-red-600 hover:text-white"
                >
                  <FaTrashAlt /> Remove Wishlist
                </button>
              ) : (
                <button
                  onClick={() => onWishlistToggle(cloth._id)}
                  className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-gray-600 hover:text-red-500 hover:border-red-500"
                >
                  <FaHeart /> Wishlist
                </button>
              )
            )}

            {isInCart ? (
              <button
                onClick={() => onCartToggle(cloth._id)}
                className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-red-600 hover:bg-red-600 hover:text-white"
              >
                <FaTrashAlt /> Remove Cart
              </button>
            ) : (
              <button
                onClick={() => onCartToggle(cloth._id)}
                className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-green-600 hover:bg-green-600 hover:text-white"
              >
                <FaCartPlus /> Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothDetails;
