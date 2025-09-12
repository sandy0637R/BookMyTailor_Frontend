import React, { useState, useEffect, useRef } from "react";
import { FiMenu } from "react-icons/fi";
import { IoMdArrowDropright } from "react-icons/io";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function Drawer() {
  const [open, setOpen] = useState(false);
  const drawerRef = useRef();
  const location = useLocation();
  const { isLoggedIn } = useSelector((state) => state.auth);

  //currentRole reactive to localStorage
  const [currentRole, setCurrentRole] = useState(localStorage.getItem("role") || "customer");

  useEffect(() => {
    // Poll localStorage every 100ms to detect changes in the same tab
    const interval = setInterval(() => {
      const storedRole = localStorage.getItem("role") || "customer";
      if (storedRole !== currentRole) {
        setCurrentRole(storedRole);
        setOpen(false); // Close drawer when role changes
      }
    }, 100);

    return () => clearInterval(interval);
  }, [currentRole]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (drawerRef.current && !drawerRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const getLinkClass = (path) =>
    location.pathname === path
      ? "drawer-btn bg-brown-tertiary text-yellow-tertiary rounded-sm"
      : "drawer-btn";

  const tailorLinks = [
    { to: "/addpost", label: "Add Posts" },
    { to: "/cloth", label: "Cloth" },
    { to: "/tailorcustom", label: "Customer Requests" },
  ];

  const customerLinks = [
    { to: "/custom", label: "Customize" },
    { to: "/measurement", label: "Measurements" },
  ];

  if (currentRole === "admin") return null;

  return (
    <div className="relative" ref={drawerRef}>
      <button
        onClick={() => setOpen(true)}
        className={`fixed top-2.5 left-2 bg-brown-tertiary text-neutral-primary w-8 h-8 transition-transform duration-300 flex 
                    items-center justify-center rounded cursor-pointer z-50 shadow-[0_0px_3px_black]
                    ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        aria-label="Open menu"
      >
        <FiMenu size={24} />
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-brown-tertiary text-neutral-primary transform transition-transform duration-300 ease-in-out 
                    ${open ? "translate-x-0" : "-translate-x-full"} w-[280px] p-4 z-40`}
      >
        <IoMdArrowDropright
          className="absolute right-2 top-2 text-neutral-primary text-3xl cursor-pointer rotate-180 rounded-sm hover:text-yellow-tertiary 
                     hover:scale-110 hover:border-t-2 hover:bg-brown-tertiary hover:border-yellow-tertiary"
          onClick={() => setOpen(false)}
        />

        <h2 className="text-xl font-bold mb-4">Menu</h2>

        <ul className="space-y-2">
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
              <Link to="/chat">
                <li className={getLinkClass("/chat")}>Messages</li>
              </Link>
              <Link to="/tailors">
                <li className={getLinkClass("/tailors")}>Posts</li>
              </Link>

              {(currentRole === "tailor" ? tailorLinks : customerLinks).map(
                (link) => (
                  <Link to={link.to} key={link.to}>
                    <li className={getLinkClass(link.to)}>{link.label}</li>
                  </Link>
                )
              )}
              <Link to="/orders">
                <li className={getLinkClass("/orders")}>MyOrders</li>
              </Link>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}
