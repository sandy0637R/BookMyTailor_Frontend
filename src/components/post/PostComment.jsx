import React from "react";
import { useDispatch, useSelector } from "react-redux";

const PostComment = ({
  post,
  commentTexts,
  setCommentTexts,
  selectedCommentId,
  setSelectedCommentId,
}) => {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.post.userId);

  const [open, setOpen] = React.useState(false);

  const handleCommentChange = (postId, text) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = (postId) => {
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
    <div className="mt-4">
      {/* Button to open comments drawer */}
      <button
        onClick={() => setOpen(true)}
        className="text-blue-600 text-sm hover:underline"
      >
        View Comments ({post.comments?.length || 0})
      </button>

      {/* Drawer */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-end z-50"
          onClick={() => setOpen(false)} // close when clicking outside
        >
          <div
            className="bg-white w-full h-1/2 rounded-t-2xl shadow-lg p-4 flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
          >
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-2 mb-2">
              <h4 className="text-md font-bold">Comments</h4>
              <button
                onClick={() => setOpen(false)}
                className="text-red-500 font-bold"
              >
                ✕
              </button>
            </div>

            {/* Comments list */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-2">
              {(post.comments || []).map((cmt) => (
                <div
                  key={cmt._id}
                  onClick={() => handleCommentClick(cmt._id, cmt.userId)}
                  className={`p-2 rounded-md transition-all ${
                    cmt.userId === userId ? "hover:bg-gray-100 cursor-pointer" : ""
                  }`}
                >
                  <span className="font-medium">
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
            <div className="flex items-center mt-4 space-x-2 border-t pt-2">
              <input
                type="text"
                placeholder="Add a comment"
                value={commentTexts[post._id] || ""}
                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                onClick={() => handleCommentSubmit(post._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
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
