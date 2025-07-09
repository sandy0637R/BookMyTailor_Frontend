import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import ClothDetails from "../components/ClothDetails";
import {
  addToCart,
  removeFromCart,
  addToWishlist,
  removeFromWishlist,
} from "../redux/authSlice";
import { toast } from "react-hot-toast";

const ClothPage = () => {
  const { clothId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wishlist, cart, isLoggedIn } = useSelector((state) => state.auth);

  const isInWishlist = wishlist?.some(
    (item) => item?._id === clothId || item === clothId
  );

  const isInCart = cart?.some(
    (entry) => entry?.item?._id === clothId || entry?.item === clothId
  );

  const handleWishlistToggle = (id) => {
    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }
    if (isInWishlist) dispatch(removeFromWishlist(id));
    else dispatch(addToWishlist(id));
  };

  const handleCartToggle = (id, action) => {
    if (!isLoggedIn) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (action === "add") dispatch(addToCart(id));
    else if (action === "remove") dispatch(removeFromCart(id));
  };

  const handleClose = () => {
    if (window.history.length <= 2) navigate("/");
    else navigate(-1);
  };

  if (!clothId) return <div className="p-4">Invalid cloth ID.</div>;

  return (
    <div className="relative min-h-screen bg-gray-100">
      <ClothDetails
        clothId={clothId}
        isInWishlist={isInWishlist}
        isInCart={isInCart}
        onWishlistToggle={handleWishlistToggle}
        onCartToggle={handleCartToggle}
        onClose={handleClose}
      />
    </div>
  );
};

export default ClothPage;
