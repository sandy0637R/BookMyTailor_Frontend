import React, { useState, useRef, useEffect } from "react";
import ViewProfileButton from "../ViewProfileButton";
import { useNavigate } from "react-router-dom";

const PostContent = ({ post }) => {
  const [expanded, setExpanded] = useState(false);
  const captionRef = useRef(null);
  const navigate = useNavigate();

  const shortCaption = post.caption ? post.caption.slice(0, 20) : "";
  const hasMore = post.caption && post.caption.length > 20;

  // ✅ Collapse when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (captionRef.current && !captionRef.current.contains(e.target)) {
        setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={captionRef}>
      <p className="text break-words whitespace-pre-wrap">
  <span className="">Caption:</span>{" "}
  {expanded ? (
    <>
      {post.caption}{" "}
      {hasMore && (
        <span
          onClick={() => setExpanded(false)}
          className="text-blue-500 cursor-pointer"
        >
          ...less
        </span>
      )}
    </>
  ) : (
    <>
      {shortCaption}
      {hasMore && (
        <span
          onClick={() => setExpanded(true)}
          className="text-blue-500 cursor-pointer"
        >
          ...more
        </span>
      )}
    </>
  )}
</p>


      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Hashtags:</span>{" "}
        {post.hashtags?.join(" ")}
      </p>
      <p className="text-sm text-gray-600 mb-1">
        <span className="font-medium">Posted by:</span>{" "}
        {post.postedBy?.name || "Unknown"}
      </p>
      {post.postedBy?.userId && (
        <ViewProfileButton userId={post.postedBy.userId} />
      )}
      <p className="text-sm text-gray-500 mb-4">
        <span className="font-medium">Posted on:</span>{" "}
        {new Date(post.createdAt).toLocaleDateString()}{" "}
        {new Date(post.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>
    </div>
  );
};

export default PostContent;
