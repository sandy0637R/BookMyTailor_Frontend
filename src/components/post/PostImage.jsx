import React from "react";

const PostImage = ({ post }) => {
  return (
    <>
      {post.images && post.images.map((img, i) => (
        <img
          key={i}
          src={img}
          alt={post.altText || "post"}
          className="w-full h-auto rounded-md mb-4"
        />
      ))}
    </>
  );
};

export default PostImage;
