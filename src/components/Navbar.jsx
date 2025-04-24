import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const Navbar = () => {
  const location = useLocation();
  const activelink = (path) => {
    return location.pathname === path
      ? "nav-btn bg-[var(--secondary)] text-[var(--highlight-color)] rounded-sm shadow-[0_0_3px_var(--highlight-color)] "
      : "nav-btn";
  };
  return (
    <div className="bg-[var(--primary)] h-13 sticky top-0 p-2 flex text-[var(--content-color)] justify-between items-center">
      <div className="ml-13 font-bold "><span className="text-[var(--highlight-color)]">Book</span>MyTailor</div>
      <div className="">
        <ul className="flex">
          <Link to="/">
            <li className={activelink("/")}>Home</li>
          </Link>
          <li className="nav-btn">Help</li>
          <li className="nav-btn">About Us</li>
          <li className="nav-btn">Services</li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
