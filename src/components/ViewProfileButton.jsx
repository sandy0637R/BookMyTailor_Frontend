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
      className={`bg-gray-200 text-gray-700 px-3 py-1 rounded hover:bg-gray-300 ${buttonClass}`}
    >
      {children}
    </button>
  );
};

export default ViewProfileButton;
