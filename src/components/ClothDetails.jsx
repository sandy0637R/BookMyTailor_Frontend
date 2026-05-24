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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
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
                ? `https://bookmytailor-backend.onrender.com${resolvedCloth.image}`
                : "/placeholder.jpg"
            }
            alt={resolvedCloth.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Right - Details */}
        <div className="w-1/2 p-6 flex flex-col justify-between bg-neutral-primary">
          <div>
            <h2 className="text-2xl font-bold mb-2 text-brown-secondary">
              {resolvedCloth.name}
            </h2>
            <p className="text-brown-primary mb-1">
              <strong className="">Description:</strong>{" "}
              {resolvedCloth.description}
            </p>
            <p className="text-brown-primary mb-1">
              <strong className="">Type:</strong> {resolvedCloth.type}
            </p>
            {resolvedCloth.manufacturer && (
              <p className="text-brown-primary mb-1">
                <strong className="">Brand:</strong>{" "}
                {resolvedCloth.manufacturer}
              </p>
            )}
            <p className="text-brown-primary mb-1">
              <strong className="">Sizes:</strong>{" "}
              {resolvedCloth.size.join(", ")}
            </p>
            <p className="text-brown-primary mb-1">
              <strong className="">Gender:</strong> {resolvedCloth.gender}
            </p>
            {resolvedCloth.tailor && resolvedCloth.tailor._id && (
              <>
                <p className="text-brown-primary mb-1">
                  <strong className="">Tailor:</strong>{" "}
                  {resolvedCloth.tailor.name}
                </p>
                <div className="mt-2">
                  <ViewProfileButton userId={resolvedCloth.tailor._id} />
                </div>
              </>
            )}

            <p className="text-xl font-bold text-yellow-tertiary mt-4">
              ₹{resolvedCloth.price}
            </p>
          </div>

          <div className="flex justify-between items-center mt-6 flex-wrap gap-2">
            {!isInCart &&
              (isInWishlist ? (
                <button
                  onClick={handleWishlistToggle}
                  className="cloth-detail-btn hover-common hover:bg-danger-secondary bg-danger-primary"
                >
                  <span className="mr-2">
                    <FaTrashAlt />
                  </span>{" "}
                  Remove Wishlist
                </button>
              ) : (
                <button
                  onClick={handleWishlistToggle}
                  className="cloth-detail-btn hover-common hover:bg-brown-secondary bg-brown-primary"
                >
                  <span className="mr-2">
                    <FaHeart />
                  </span>{" "}
                  Wishlist
                </button>
              ))}

            {isInCart ? (
              <div className="flex items-center gap-2 w-[100%] justify-center text-brown-primary mb-2">
                <button
                  onClick={handleRemoveFromCart}
                  className="px-3 py-1 text-lg font-bold bg-brown-secondary hover:bg-brown-primary text-neutral-primary hover-common rounded-sm"
                >
                  -
                </button>
                <span className="text-lg">{quantity}</span>
                <button
                  onClick={handleAddToCart}
                  className="px-3 py-1 text-lg font-bold bg-brown-secondary hover:bg-brown-primary text-neutral-primary hover-common rounded-sm"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="cloth-detail-btn hover-common hover:bg-brown-primary bg-brown-secondary"
              >
                <span className="mr-2">
                  <FaCartPlus />
                </span>{" "}
                Add to Cart
              </button>
            )}
            <button
              onClick={onClose}
              className="cloth-detail-btn hover-common hover:bg-brown-primary bg-brown-secondary"
            >
              <span className="mr-2">
                <FaArrowLeft />
              </span>{" "}
              Back
            </button>

            <button
              onClick={handleCopyLink}
              className="cloth-detail-btn bg-brown-primary hover:bg-brown-secondary hover-common"
            >
              <span className="mr-2">
                <FaLink />
              </span>{" "}
              Copy Link
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClothDetails;
