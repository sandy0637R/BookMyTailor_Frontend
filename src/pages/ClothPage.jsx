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
import { toast } from "react-hot-toast"; // ✅ Add toast

const ClothPage = () => {
  const { clothId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wishlist, cart, isLoggedIn } = useSelector((state) => state.auth); // ✅ Add isLoggedIn

  const isInWishlist = wishlist?.some(
    (item) => item?._id === clothId || item === clothId
  );

  const isInCart = cart?.some(
    (entry) => entry?.item?._id === clothId || entry === clothId
  );

  const handleWishlistToggle = (id) => {
    if (!isLoggedIn) {
      toast.error("Please login first");        // ✅ Show toast
      navigate("/login");                      // ✅ Redirect to login
      return;
    }
    if (isInWishlist) dispatch(removeFromWishlist(id));
    else dispatch(addToWishlist(id));
  };

  const handleCartToggle = (id) => {
    if (!isLoggedIn) {
      toast.error("Please login first");        // ✅ Show toast
      navigate("/login");                      // ✅ Redirect to login
      return;
    }
    if (isInCart) dispatch(removeFromCart(id));
    else dispatch(addToCart(id));
  };

  const handleClose = () => {
    if (window.history.length <= 2) navigate("/"); // ✅ Fallback to home
    else navigate(-1);                             // ✅ Go back
  };

  if (!clothId) return <div className="p-4">Invalid cloth ID.</div>;

  return (
    <div className="relative min-h-screen bg-gray-100 ">
      <ClothDetails
        clothId={clothId}
        isInWishlist={isInWishlist}
        isInCart={isInCart}
        onWishlistToggle={handleWishlistToggle}
        onCartToggle={handleCartToggle}
        onClose={handleClose} // ✅ Use smart back/home handler
      />
    </div>
  );
};

export default ClothPage;
