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
      ? "drawer-btn bg-yellow-tertiary text-brown-tertiary rounded-lg shadow-glowing scale-[1.02] font-extrabold border-l-4 border-brown-primary px-4 py-2.5 flex items-center justify-between"
      : "drawer-btn text-neutral-primary/85 hover:text-yellow-tertiary hover:pl-4 hover:bg-brown-secondary/35 transition-all duration-200 px-3 py-2.5 rounded-lg flex items-center";

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
        className={`fixed top-2.5 left-4 bg-brown-tertiary text-yellow-tertiary w-9 h-9 border border-yellow-tertiary/20 hover:scale-105 active:scale-95 transition-all duration-200 flex 
                    items-center justify-center rounded-lg cursor-pointer z-50 shadow-premium
                    ${open ? "opacity-0 pointer-events-none" : "opacity-100"}`}
        aria-label="Open menu"
      >
        <FiMenu size={20} />
      </button>

      <div
        className={`fixed top-0 left-0 h-screen bg-brown-tertiary/95 backdrop-blur-md text-neutral-primary transform transition-transform duration-300 ease-in-out border-r border-yellow-tertiary/10
                    ${open ? "translate-x-0" : "-translate-x-full"} w-[280px] p-6 z-40 shadow-premium`}
      >
        <IoMdArrowDropright
          className="absolute right-4 top-4 text-neutral-primary/80 text-3xl cursor-pointer rotate-180 rounded-lg hover:text-yellow-tertiary 
                     hover:scale-110 transition"
          onClick={() => setOpen(false)}
        />

        <h2 className="text-sm font-extrabold mb-8 tracking-widest text-yellow-tertiary border-b border-yellow-tertiary/20 pb-3 uppercase">Navigation</h2>

        <ul className="space-y-2">
          <Link to="/">
            <li className={getLinkClass("/")}>Home</li>
          </Link>

          {!isLoggedIn && (
            <>
              <Link to="/tailors">
                <li className={getLinkClass("/tailors")}>Posts</li>
              </Link>
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
