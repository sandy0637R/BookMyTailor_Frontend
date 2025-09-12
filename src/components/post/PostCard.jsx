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
    <div className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200">
      <PostImage post={post} />
<div className="flex  items-center w-full border-t-3 border-brown-primary p-2 justify-between"><div className="flex gap-5"><Like post={post} />
     <PostComment
        post={post}
        commentTexts={commentTexts}
        setCommentTexts={setCommentTexts}
        selectedCommentId={selectedCommentId}
        setSelectedCommentId={setSelectedCommentId}
      /></div>
      <div className="flex gap-3 mt-3 mb-4">
        {post.productLink && (
          <button
            onClick={() =>
              navigate(`/cloths/${post.productLink.split("/cloths/")[1]}`)
            }
            className="bg-brown-primary text-neutral-primary w-[40px] h-[40px] flex justify-center items-center rounded-full text-lg hover:bg-brown-secondary hover-common"
          >
           <FaBoxOpen />
          </button>
        )}
      
  {post.postedBy?.userId && (
    <ViewProfileButton
      userId={post.postedBy.userId}
      buttonClass="bg-brown-tertiary text-neutral-primary w-[40px] h-[40px] flex justify-center items-center text-xl rounded-full hover:bg-brown-primary hover-common"
    >
      <FaUser/>
    </ViewProfileButton>
  )}

</div>


      </div>

      <PostContent post={post} />
      
    </div>
  );
};

export default PostCard;
