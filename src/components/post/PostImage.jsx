import React from "react";

const PostImage = ({ post }) => {
  return (
    <div className="w-full h-[400px] flex justify-center items-center bg-yellow-primary shadow-inner rounded-md mb-4 overflow-hidden">
      {post.images &&
        post.images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={post.altText || "post"}
            className="max-h-full max-w-full object-contain"
          />
        ))}
    </div>
  );
};

export default PostImage;
