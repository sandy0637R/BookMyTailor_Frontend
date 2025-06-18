import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FaHeart, FaShoppingCart } from "react-icons/fa";

const Navbar = () => {
  const location = useLocation();
  const wishlist = useSelector((state) => state.auth.wishlist);
  const cart = useSelector((state) => state.auth.cart);

  const activelink = (path) =>
    location.pathname === path
      ? "nav-btn bg-[var(--secondary)] text-[var(--highlight-color)] rounded-sm shadow-[0_0_3px_var(--highlight-color)]"
      : "nav-btn";

  return (
    <div className="bg-[var(--primary)] h-13 fixed w-screen top-0 p-2 flex text-[var(--content-color)] justify-between items-center ">
      <div className="ml-13 font-bold">
        <span className="text-[var(--highlight-color)]">Book</span>MyTailor
      </div>

      <ul className="flex items-center gap-3">
        <Link to="/">
          <li className={activelink("/")}>Home</li>
        </Link>

        <li className="nav-btn">Help</li>
        <li className="nav-btn">About Us</li>
        <li className="nav-btn">Services</li>

        {/* Wishlist Link */}
        <Link to="/wishlist">
          <li className={activelink("/wishlist") + " relative flex items-center"}>
            <FaHeart className="mr-1" />
            Wishlist
            {wishlist.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
                {wishlist.length}
              </span>
            )}
          </li>
        </Link>

        {/* Cart Link */}
        <Link to="/cart">
          <li className={activelink("/cart") + " relative flex items-center"}>
            <FaShoppingCart className="mr-1" />
            Cart
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs font-bold px-1 rounded-full">
                {cart.length}
              </span>
            )}
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Navbar;
