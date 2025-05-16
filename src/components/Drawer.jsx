import React, { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdArrowDropright } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef();
  const location = useLocation();

  // Get isLoggedIn from Redux
  const { isLoggedIn } = useSelector((state) => state.auth);

  // Get current role from localStorage or default to "customer"
  const currentRole = localStorage.getItem("role") || "customer";

  // Handle outside click to close drawer
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

  return (
    <div className="relative" ref={drawerRef}>
      <div
        onClick={() => setOpen(!open)}
        className={`fixed top-2.5 left-2 bg-[var(--primary)] text-[var(--content-color)] w-8 h-8 transition-all duration-300 flex 
                    items-center justify-center rounded cursor-pointer z-50 shadow-[0_0px_3px_black] ${
                      open ? "scale-0" : "scale-100"
                    }`}
      >
        <FiMenu size={24} />
      </div>

      <div
        className={`fixed top-0 left-0 h-screen bg-[var(--primary)] text-[var(--content-color)] transition-all duration-300 ease-in-out 
                    ${
                      open ? "w-[280px] p-4" : "w-0 p-0"
                    } overflow-hidden z-40 relative`}
      >
        <IoMdArrowDropright
          className="absolute right-2 top-2 text-[var(--content-color)] text-3xl cursor-pointer rotate-180 rounded-sm hover:text-[var(--highlight-color)] 
                    hover:scale-110 hover:border-t-2 hover:bg-[var(--secondary)] hover:border-[var(--highlight-color)] hover:rounded-2"
          onClick={() => setOpen(!open)}
        />
        <h2 className="text-xl font-bold mb-4">Menu</h2>
        <ul>
          <Link to="/">
            <li className={getLinkClass("/")}>Home</li>
          </Link>

          {!isLoggedIn && (
            <>
              <Link to="/login">
                <li className={getLinkClass("/login")}>Login</li>
              </Link>
              <Link to="/register">
                <li className={getLinkClass("/register")}>Register</li>
              </Link>
            </>
          )}

          {isLoggedIn && (
            <>
              <Link to="/profile">
                <li className={getLinkClass("/profile")}>Profile</li>
              </Link>
              <Link to="/pallete">
                <li className={getLinkClass("/pallete")}>Color Tone</li>
              </Link>
              {currentRole === "tailor" && (
                <Link to="/addpost">
                  <li className={getLinkClass("/addpost")}>Posts</li>
                </Link>
              )}
            </>
          )}

          <Link to="/tailors">
            <li className={getLinkClass("/tailors")}>Tailors</li>
          </Link>
        </ul>
      </div>
    </div>
  );
}
