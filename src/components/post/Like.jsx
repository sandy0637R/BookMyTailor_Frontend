import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { BiSolidLike } from "react-icons/bi";


const Like = ({ post }) => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.post.userId);

  const handleLike = () => {
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
