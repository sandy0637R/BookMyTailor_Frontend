import React, { useState } from "react";
import PostImage from "./PostImage";
import PostContent from "./PostContent";
import Like from "./Like";
import PostComment from "./PostComment";
import { useNavigate } from "react-router-dom";

const PostCard = ({ post }) => {
  const navigate = useNavigate();
  const [commentTexts, setCommentTexts] = useState({});
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
      <PostImage post={post} />
      {post.productLink && (
        <button
          onClick={() => navigate(`/cloths/${post.productLink.split("/cloths/")[1]}`)}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mb-4"
        >
          View Product
        </button>
      )}
      <PostContent post={post} />
      <Like post={post} />
      <PostComment
        post={post}
        commentTexts={commentTexts}
        setCommentTexts={setCommentTexts}
        selectedCommentId={selectedCommentId}
        setSelectedCommentId={setSelectedCommentId}
      />
    </div>
  );
};

export default PostCard;
