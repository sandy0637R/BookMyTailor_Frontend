import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { FaHeart, FaShoppingCart, FaUser, FaSignOutAlt } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import Drawer from "./Drawer";
import { logout } from "../redux/authSlice";
import { toast } from "react-hot-toast";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { wishlist, cart, role, roles } = useSelector((state) => state.auth);
  const currentRole = role || (Array.isArray(roles) ? roles[0] : "customer");

  const activelink = (path) =>
    location.pathname === path
      ? "nav-btn bg-yellow-tertiary text-brown-tertiary rounded-lg shadow-glowing flex items-center gap-1.5 px-3.5 py-1.5 scale-105"
      : "nav-btn flex items-center gap-1.5 px-3.5 py-1.5 text-neutral-primary/95 hover:text-yellow-tertiary";

  const handleLogout = async () => {
    const result =await window.confirm("Are you sure you want to logout?")
    if (result) {
      setTimeout(() => {
        dispatch(logout());
        toast.success("Logged out successfully!");
        navigate("/login");
      }, 500); 
    }
  };

  return (
    <>
      <div className="bg-brown-tertiary/90 backdrop-blur-md h-14 fixed w-screen top-0 px-6 flex text-neutral-primary justify-between items-center z-30 border-b border-yellow-tertiary/15 shadow-premium">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <Drawer />
          <Link to="/"> 
            <div className="font-extrabold text-xl tracking-wider select-none hover:opacity-90 transition ml-8">
              <span className="text-yellow-tertiary">Stich</span>Mate
            </div>
          </Link>
        </div>

        {/* Right Side */}
        <ul className="flex items-center gap-2">
          {currentRole === "admin" ? (
            <>
              <Link to="/admin">
                <li className={activelink("/admin")}>
                  <MdDashboard /> Dashboard
                </li>
              </Link>
              <Link to="/profile">
                <li className={activelink("/profile")}>
                  <span className="mr-1"> <FaUser /></span> Profile
                </li>
              </Link>
              <li
                onClick={handleLogout}
                className="flex justify-center items-center p-1.5 px-4 rounded-lg bg-gradient-danger text-white hover-common font-semibold text-sm cursor-pointer mx-2 shadow-sm transition active:scale-95"
              >
                <span className="mr-1.5"><FaSignOutAlt /></span> Logout
              </li>
            </>
          ) : (
            <>
              <Link to="/">
                <li className={activelink("/")}>Home</li>
              </Link>

              {/* Wishlist */}
              <Link to="/wishlist">
                <li
                  className={activelink("/wishlist") + " relative flex items-center"}
                >
                  <FaHeart className="mr-1.5" />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-gradient-danger text-white text-[10px] font-extrabold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {wishlist.length}
                    </span>
                  )}
                </li>
              </Link>

              {/* Cart */}
              <Link to="/cart">
                <li
                  className={activelink("/cart") + " relative flex items-center"}
                >
                  <FaShoppingCart className="mr-1.5" />
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-green-600 text-white text-[10px] font-extrabold h-4 min-w-[16px] px-1 rounded-full flex items-center justify-center shadow-md animate-pulse">
                      {cart.length}
                    </span>
                  )}
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>

      <div className="h-14" />
    </>
  );
};

export default Navbar;
