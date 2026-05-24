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
      ? "nav-btn bg-brown-tertiary text-yellow-tertiary rounded-sm shadow-[0_0_3px_rgb(230,179,37)] flex items-center gap-1 px-2 py-1"
      : "nav-btn flex items-center gap-1 px-2 py-1";

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
      <div className="bg-brown-tertiary h-13 fixed w-screen top-0 p-2 flex text-neutral-primary justify-between items-center z-30 border-b border-brown-secondary">
        {/* Left Side */}
        <div className="flex items-center gap-3">
          <Drawer />
         <Link to="/"> <div className="font-bold">
            <span className="text-yellow-tertiary ml-8">Stich</span>Mate
          </div></Link>
        </div>

        {/* Right Side */}
        <ul className="flex items-center gap-3">
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
                className="flex justify-center items-center p-1 px-3 rounded bg-danger-secondary hover:bg-danger-primary hover-common mx-2 "
              >
                <span className="mr-1"><FaSignOutAlt /></span> Logout
              </li>
            </>
          ) : (
            <>
              <Link to="/">
                <li className={activelink("/")}>Home</li>
              </Link>
              {/* <li className="nav-btn">Help</li>
              <li className="nav-btn">About Us</li>
              <li className="nav-btn">Services</li> */}

              {/* Wishlist */}
              <Link to="/wishlist">
                <li
                  className={activelink("/wishlist") + " relative flex items-center"}
                >
                  <FaHeart className="mr-1" />
                  Wishlist
                  {wishlist.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold px-1 rounded-full">
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
                  <FaShoppingCart className="mr-1" />
                  Cart
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-3 bg-green-500 text-white text-xs font-bold px-1 rounded-full">
                      {cart.length}
                    </span>
                  )}
                </li>
              </Link>
            </>
          )}
        </ul>
      </div>

      <div className="h-13" />
    </>
  );
};

export default Navbar;
