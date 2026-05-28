import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RoleRoute = ({ allowedRoles, children }) => {
  const userRole = useSelector((state) => state.auth.role) || "customer";

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RoleRoute;
