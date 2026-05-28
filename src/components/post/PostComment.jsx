import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaComments } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const PostComment = ({
  post,
  commentTexts,
  setCommentTexts,
  selectedCommentId,
  setSelectedCommentId,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userId = useSelector((state) => state.auth.profile?._id);

  const [open, setOpen] = React.useState(false);

  const handleCommentChange = (postId, text) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const handleInputFocus = () => {
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to comment on a post. Would you like to log in now?")) {
        navigate("/login");
      }
    }
  };

  const handleCommentSubmit = (postId) => {
    if (!isLoggedIn) {
      if (window.confirm("You must be logged in to comment on a post. Would you like to log in now?")) {
        navigate("/login");
      }
      return;
    }
    const text = commentTexts[postId];
    if (!text) return;
    dispatch({ type: "COMMENT_POST", payload: { postId, text } });
    setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
  };

  const handleDeleteComment = (postId, commentId) => {
    dispatch({ type: "DELETE_COMMENT", payload: { postId, commentId } });
    setSelectedCommentId(null);
  };

  const handleCommentClick = (commentId, userIdOfComment) => {
    if (selectedCommentId === commentId) {
      setSelectedCommentId(null);
    } else {
      if (String(userIdOfComment) === String(userId)) {
        setSelectedCommentId(commentId);
      } else {
        setSelectedCommentId(null);
      }
    }
  };

  return (
    <div>
      {/* Button to open comments drawer */}
      <button
        onClick={() => setOpen(true)}
        className=" flex justify-center items-center h-[40px] px-4 bg-yellow-primary text-lg text-yellow-tertiary rounded hover:bg-yellow-100 transition-all duration-200"
      >
        <span className="mr-2"><FaComments/></span> {post.comments?.length || 0}
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
          onClick={() => setOpen(false)} 
        >
          <div
            className="bg-yellow-50 w-full h-1/2 rounded-t-lg shadow-lg p-4 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()} 
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b-2 pb-2 mb-2 text-brown-secondary">
              <h4 className="text-md font-bold">Comments</h4>
              <button
                onClick={() => setOpen(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 text-brown-secondary">
              {(post.comments || []).map((cmt) => (
                <div
                  key={cmt._id}
                  onClick={() => handleCommentClick(cmt._id, cmt.userId)}
                  className={`p-2 rounded-md transition-all ${
                    cmt.userId === userId ? "hover:bg-yellow-primary cursor-pointer" : ""
                  }`}
                >
                  <span className="font-medium text-brown-tertiary">
                    {cmt.userName || cmt.commentedBy?.name || "User"}:
                  </span>{" "}
                  {cmt.text || cmt.commentText || "No content"}

                  {selectedCommentId === cmt._id && cmt.userId === userId && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteComment(post._id, cmt._id);
                      }}
                      className="ml-4 text-sm text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Add comment input */}
            <div className="flex items-center mt-4 space-x-2 border-t-2 pt-2 text-brown-secondary">
              <input
                type="text"
                placeholder="Add a comment"
                value={commentTexts[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                onFocus={handleInputFocus}
                className="flex-1 border border-yellow-tertiary bg-yellow-primary rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brown-primary"
              />
              <button
                onClick={() => handleCommentSubmit(post._id)}
                className="bg-brown-primary text-white px-4 py-2 rounded-md hover:bg-yellow-tertiary hover-common"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostComment;
