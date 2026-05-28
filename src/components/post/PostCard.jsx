import React, { useState } from "react";
import PostImage from "./PostImage";
import PostContent from "./PostContent";
import Like from "./Like";
import PostComment from "./PostComment";
import ViewProfileButton from "../ViewProfileButton";
import { FaUser } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { useNavigate } from "react-router";

const PostCard = ({ post }) => {

  const [commentTexts, setCommentTexts] = useState({});
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="bg-neutral-primary rounded-2xl border border-brown-primary/10 shadow-premium p-6 mb-8 hover-common transition duration-300 flex flex-col justify-between">
      {/* Top Designer Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-brown-primary/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-gold flex items-center justify-center text-neutral-primary font-bold shadow-sm">
            {post.postedBy?.name?.charAt(0).toUpperCase() || "D"}
          </div>
          <div>
            <h4 className="font-bold text-brown-secondary text-sm tracking-wide">{post.postedBy?.name || "Designer"}</h4>
            <p className="text-[11px] text-brown-primary/60">{post.postedBy?.email || ""}</p>
          </div>
        </div>
        <span className="text-[11px] font-semibold text-brown-primary/60 bg-yellow-primary/45 px-2.5 py-1 rounded-full border border-yellow-tertiary/10">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="relative overflow-hidden rounded-xl border border-brown-primary/5 shadow-premium mb-4">
        <PostImage post={post} />
      </div>

      {/* Floating Action Bar */}
      <div className="flex items-center justify-between py-3 border-y border-brown-primary/10 mb-4 bg-yellow-primary/15 px-3 rounded-xl">
        <div className="flex gap-4">
          <Like post={post} />
          <PostComment
            post={post}
            commentTexts={commentTexts}
            setCommentTexts={setCommentTexts}
            selectedCommentId={selectedCommentId}
            setSelectedCommentId={setSelectedCommentId}
          />
        </div>
        <div className="flex gap-2">
          {post.productLink && (
            <button
              onClick={() =>
                navigate(`/cloths/${post.productLink.split("/cloths/")[1]}`)
              }
              title="View Product Details"
              className="bg-brown-primary text-neutral-primary w-9 h-9 flex justify-center items-center rounded-lg hover:bg-brown-secondary hover-common transition shadow-sm active:scale-95 cursor-pointer"
            >
              <FaBoxOpen size={16} />
            </button>
          )}
        
          {post.postedBy?.userId && (
            <ViewProfileButton
              userId={post.postedBy.userId}
              buttonClass="bg-brown-tertiary text-neutral-primary w-9 h-9 flex justify-center items-center rounded-lg hover:bg-brown-primary hover-common transition shadow-sm active:scale-95 cursor-pointer"
            >
              <FaUser size={16} />
            </ViewProfileButton>
          )}
        </div>
      </div>

      <PostContent post={post} />
    </div>
  );
};

export default PostCard;
