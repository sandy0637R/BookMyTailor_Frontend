import React from "react";
import { useSelector } from "react-redux";
import PostCard from "./PostCard";

const AllPost = () => {
  const posts = useSelector((state) => state.post.posts);

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No posts found.</p>;
  }

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}
    </>
  );
};

export default AllPost;
