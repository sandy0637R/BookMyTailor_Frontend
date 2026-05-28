import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidLike } from "react-icons/bi";


import { useNavigate } from "react-router-dom";


const Like = ({ post }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  const handleLike = () => {
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to like a post. Would you like to log in now?")) {
        navigate("/login");
      }
      return;
    }
    dispatch({ type: "LIKE_POST", payload: { postId: post._id } });
  };

  return (
    <button
      onClick={handleLike}
      className="flex justify-center items-center h-[40px] px-4 bg-yellow-primary text-lg text-yellow-tertiary rounded hover:bg-yellow-100 transition-all duration-200"
    >
      <span className="mr-2"><BiSolidLike/></span> {post.likes?.length || 0}
    </button>
  );
};

export default Like;
