import React, { useState } from "react";
import PostImage from "./PostImage";
import PostContent from "./PostContent";
import Like from "./Like";
import PostComment from "./PostComment";


const PostCard = ({ post }) => {

  const [commentTexts, setCommentTexts] = useState({});
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
      <PostImage post={post} />

      <div className="flex gap-3 mt-3 mb-4">
        {post.productLink && (
          <button
            onClick={() =>
              navigate(`/cloths/${post.productLink.split("/cloths/")[1]}`)
            }
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            View Product
          </button>
        )}

      </div>

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
