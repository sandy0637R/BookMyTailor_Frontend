import React from "react";
import { useDispatch, useSelector } from "react-redux";

const Like = ({ post }) => {
  const dispatch = useDispatch();

  const userId = useSelector((state) => state.post.userId);

  const handleLike = () => {
    dispatch({ type: "LIKE_POST", payload: { postId: post._id } });
  };

  return (
    <button
      onClick={handleLike}
      className="px-4 py-2 rounded-md font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
    >
      Like {post.likes?.length || 0}
    </button>
  );
};

export default Like;
