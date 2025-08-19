import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ViewProfileButton = ({ userId, buttonClass = "", children = "View Profile" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedUser = useSelector((state) => state.social.selectedUser);

  const handleClick = () => {
    dispatch({ type: "FETCH_USER_BY_ID", payload: { userId } });
  };

  useEffect(() => {
    if (selectedUser && selectedUser._id === userId) {
      if (selectedUser.roles?.includes("tailor")) {
        navigate(`/tailorprofile/${selectedUser._id}`);
      } else {
        navigate(`/customerprofile/${selectedUser._id}`);
      }
    }
  }, [selectedUser, userId, navigate]);

  return (
    <button
      onClick={handleClick}
      className={`bg-brown-primary text-neutral-primary px-3 py-1 rounded hover-common ${buttonClass}`}
    >
      {children}
    </button>
  );
};

export default ViewProfileButton;
