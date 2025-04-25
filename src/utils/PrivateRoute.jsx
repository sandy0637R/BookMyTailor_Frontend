import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Notification from "../utils/Notification";

const PrivateRoute = ({ children }) => {
  const [cookies] = useCookies(["token"]);
  const [showNotification, setShowNotification] = useState(false);
  const [redirect, setRedirect] = useState(false);

  useEffect(() => {
    if (!cookies.token) {
      setShowNotification(true);
      setTimeout(() => setRedirect(true), 2000); // delay redirect
    }
  }, [cookies.token]);

  if (cookies.token) return children;

  return (
    <>
      {showNotification && (
        <Notification
          message="You must log in first!"
          onClose={() => setShowNotification(false)}
        />
      )}
      {redirect && <Navigate to="/login" />}
    </>
  );
};

export default PrivateRoute;
