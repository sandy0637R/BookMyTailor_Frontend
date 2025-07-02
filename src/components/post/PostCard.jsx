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
