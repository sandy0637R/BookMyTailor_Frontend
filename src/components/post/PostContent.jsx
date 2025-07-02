import React from "react";

const PostContent = ({ post }) => {
  return (
    <>
      <p className="text-lg font-semibold">
        <span className="text-gray-600">Caption:</span> {post.caption}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Hashtags:</span> {post.hashtags?.join(" ")}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Posted by:</span> {post.postedBy?.name || "Unknown"}
      </p>
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Posted on:</span>{" "}
        {new Date(post.createdAt).toLocaleDateString()}{" "}
        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </p>
    </>
  );
};

export default PostContent;
