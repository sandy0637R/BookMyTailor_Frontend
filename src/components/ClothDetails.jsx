import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FaHeart,
  FaTrashAlt,
  FaCartPlus,
  FaArrowLeft,
  FaLink,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import { getClothByIdRequest } from "../redux/authSlice";
import ViewProfileButton from "./ViewProfileButton"; // ✅ Imported child component

const ClothDetails = ({
  cloth,
  clothId,
  onClose,
  isInWishlist,
  isInCart,
  onWishlistToggle,
  onCartToggle,
}) => {
  const dispatch = useDispatch();
  const { singleCloth, loading, error, cart } = useSelector(
    (state) => state.auth
  );

  const resolvedCloth = cloth || singleCloth;
  const id = resolvedCloth && resolvedCloth._id ? resolvedCloth._id : clothId;

  useEffect(() => {
    if (!cloth && clothId) {
      dispatch(getClothByIdRequest(clothId));
    }
  }, [clothId, cloth, dispatch]);

  const handleCopyLink = () => {
    const link = `${window.location.origin}/cloths/${id}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copied to clipboard!");
  };

  const handleWishlistToggle = () => {
    onWishlistToggle(id);
  };

  const handleAddToCart = () => {
    onCartToggle(id, "add");
  };

  const handleRemoveFromCart = () => {
    onCartToggle(id, "remove");
  };

  const getCartQuantity = (id) =>
    cart.find((entry) => entry.item === id)?.quantity || 0;

  const quantity = getCartQuantity(id);

  if (!resolvedCloth || loading) return <div className="p-4">Loading...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

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
            src={
              resolvedCloth.image?.startsWith("/uploads")
                ? `http://localhost:5000${resolvedCloth.image}`
                : "/placeholder.jpg"
            }
            alt={resolvedCloth.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Details */}
        <div className="w-1/2 p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{resolvedCloth.name}</h2>
            <p className="text-gray-600 mb-1">
              <strong>Description:</strong> {resolvedCloth.description}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Type:</strong> {resolvedCloth.type}
            </p>
            {resolvedCloth.manufacturer && (
              <p className="text-gray-600 mb-1">
                <strong>Brand:</strong> {resolvedCloth.manufacturer}
              </p>
            )}
            <p className="text-gray-600 mb-1">
              <strong>Sizes:</strong> {resolvedCloth.size.join(", ")}
            </p>
            <p className="text-gray-600 mb-1">
              <strong>Gender:</strong> {resolvedCloth.gender}
            </p>
            {resolvedCloth.tailor && resolvedCloth.tailor._id && (
              <>
                <p className="text-gray-600 mb-1">
                  <strong>Tailor:</strong> {resolvedCloth.tailor.name}
                </p>
                <div className="mt-2">
                  <ViewProfileButton userId={resolvedCloth.tailor._id} />
                </div>
              </>
            )}

            <p className="text-xl font-bold text-green-600 mt-4">
              ₹{resolvedCloth.price}
            </p>
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

            {!isInCart &&
              (isInWishlist ? (
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-red-600 hover:bg-red-600 hover:text-white"
                >
                  <FaTrashAlt /> Remove Wishlist
                </button>
              ) : (
                <button
                  onClick={handleWishlistToggle}
                  className="flex items-center gap-2 text-sm px-3 py-1 border rounded-xl text-gray-600 hover:text-red-500 hover:border-red-500"
                >
                  <FaHeart /> Wishlist
                </button>
              ))}

            {isInCart ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRemoveFromCart}
                  className="px-2 py-1 text-lg font-bold border rounded hover:bg-red-100"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={handleAddToCart}
                  className="px-2 py-1 text-lg font-bold border rounded hover:bg-green-100"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
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
