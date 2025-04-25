import React, { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdArrowDropright } from "react-icons/io";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Notification from "../utils/Notification"; // Your notification component

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [notification, setNotification] = useState(""); // State for notification message
  const drawerRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    window.addEventListener("storage", checkAuth); // Listen for changes
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const getLinkClass = (path) => {
    return location.pathname === path
      ? "drawer-btn bg-[var(--secondary)] text-[var(--highlight-color)] rounded-sm"
      : "drawer-btn";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setNotification("Logged out successfully!"); // Show logout notification
    window.dispatchEvent(new Event("storage")); // Trigger update
    setTimeout(() => {
      navigate("/"); // Redirect to home after 2 seconds
    }, 2000);
  };

  return (
    <div className="relative" ref={drawerRef}>
      <div
        onClick={() => setOpen(!open)}
        className={`fixed top-2.5 left-2 bg-[var(--primary)] text-[var(--content-color)] w-8 h-8 transition-all duration-300 flex 
                    items-center justify-center rounded cursor-pointer z-50  shadow-[0_0px_3px_black] ${
                      open && "scale-0"
                    } hover:text-[var(--highlight-color)] hover:bg-[var(--secondary)]`}
      >
        <FiMenu size={24} />
      </div>

      <div
        className={`fixed top-0 left-0 h-screen bg-[var(--primary)] text-[var(--content-color)] transition-all duration-300 ease-in-out ${
          open ? "w-[280px]" : "w-0"
        } overflow-hidden z-40 relative ${open ? "p-4" : "p-0"}`}
      >
        <IoMdArrowDropright
          className="absolute right-2 top-2 text-[var(--content-color)] text-3xl cursor-pointer rotate-180 rounded-sm hover:text-[var(--highlight-color)] 
          hover:scale-110 hover:border-t-2 hover:bg-[var(--secondary)] hover:border-[var(--highlight-color)] hover:rounded-2"
          onClick={() => setOpen(!open)}
        />
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul>
          <Link to="/"><li className={getLinkClass("/")}>Home</li></Link>

          {!isLoggedIn && (
            <>
              <Link to="/login"><li className={getLinkClass("/login")}>Login</li></Link>
              <Link to="/register"><li className={getLinkClass("/register")}>Register</li></Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link to="/profile"><li className={getLinkClass("/profile")}>Profile</li></Link>
              <li className="drawer-btn hover:bg-red-400 hover:text-white" onClick={handleLogout}>Logout</li>
            </>
          )}

          <Link to="/tailors"><li className={getLinkClass("/tailors")}>Tailors</li></Link>
        </ul>
      </div>

      {notification && (
        <Notification
          message={notification}
          onClose={() => setNotification("")}
        />
      )}
    </div>
  );
}
