import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Tailors = () => {
  const dispatch = useDispatch();
  const posts = useSelector((state) => state.post.posts);
  const userId = useSelector((state) => state.post.userId); // from postSlice
  const token = useSelector((state) => state.auth.token);

  const [commentTexts, setCommentTexts] = useState({});
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch({ type: "FETCH_POSTS" });
      dispatch({ type: "SET_USER_FROM_TOKEN" });
    }
  }, [token, dispatch]);

  const hasUserLiked = (post) => {
    return post.likes?.some((likeId) => likeId === userId);
  };

  const handleLike = (postId) => {
    dispatch({ type: "LIKE_POST", payload: { postId } });
  };

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
    <div className="max-w-4xl mx-auto px-4 py-8 mt-15">
      <h2 className="text-3xl font-bold text-center mb-6">Tailors & Users Posts</h2>
      {posts.length === 0 && <p className="text-center text-gray-500">No posts found.</p>}
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200"
        >
          {post.images && post.images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={post.altText || "post"}
              className="w-full h-auto rounded-md mb-4"
            />
          ))}
          <p className="text-lg font-semibold"><span className="text-gray-600">Caption:</span> {post.caption}</p>
          <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Hashtags:</span> {post.hashtags?.join(" ")}</p>
          <p className="text-sm text-gray-600 mb-4"><span className="font-medium">Posted by:</span> {post.postedBy?.name || "Unknown"}</p>

          <button
            onClick={() => handleLike(post._id)}
            className="px-4 py-2 rounded-md font-medium bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
          >
            Like {post.likes?.length || 0}
          </button>

          <div className="mt-4">
            <h4 className="text-md font-bold mb-2">Comments</h4>
            <div className="space-y-2">
              {(post.comments || []).map((cmt) => (
                <div
                  key={cmt._id}
                  onClick={() => handleCommentClick(cmt._id, cmt.userId)}
                  className={`p-2 rounded-md transition-all ${
                    cmt.userId === userId
                      ? "hover:bg-gray-100 cursor-pointer"
                      : ""
                  }`}
                >
                  <span className="font-medium">{cmt.commentedBy?.name || "User"}:</span> {cmt.text}
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

            <div className="flex items-center mt-4 space-x-2">
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
      ))}
    </div>
  );
};

export default Tailors;
