import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux"; // Use Redux to get authentication state
import toast from 'react-hot-toast'; // Import toast from react-hot-toast

const PrivateRoute = ({ children }) => {
  const { isLoggedIn } = useSelector(state => state.auth); // Get auth state from Redux

  useEffect(() => {
    if (!isLoggedIn) {
      toast.error("You must log in first!"); // Show error toast if not logged in
    }
  }, [isLoggedIn]);

  if (isLoggedIn) {
    return children; // Render children if logged in
  }

  return (
    <Navigate to="/login" replace /> // Redirect to login page if not logged in
  );
};

export default PrivateRoute;
