import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const Tailors = () => {
  const [posts, setPosts] = useState([]);
  const [commentTexts, setCommentTexts] = useState({});
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [userId, setUserId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken?._id || null);
    }
  }, [token]);

  useEffect(() => {
    const fetchPostsAndComments = async () => {
      try {
        const postsRes = await axios.get("http://localhost:5000/tailors/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const postsData = postsRes.data;

        const postsWithComments = await Promise.all(
          postsData.map(async (post) => {
            try {
              const commentsRes = await axios.get(
                `http://localhost:5000/tailors/posts/${post._id}/comments`,
                { headers: { Authorization: `Bearer ${token}` } }
              );

              const mappedComments = commentsRes.data.map((cmt) => ({
                _id: cmt._id,
                text: cmt.commentText,
                userId: cmt.userId,
                commentedBy: { name: cmt.userName },
                createdAt: cmt.createdAt,
              }));

              return { ...post, comments: mappedComments };
            } catch {
              return { ...post, comments: [] };
            }
          })
        );

        setPosts(postsWithComments);
      } catch {}
    };

    fetchPostsAndComments();
  }, [token]);

  const hasUserLiked = (post) => {
    return post.likes?.some((likeId) => likeId === userId);
  };

  const handleLike = async (postId) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/tailors/posts/${postId}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedPostFromBackend = res.data.post;
      const oldPost = posts.find((p) => p._id === postId);

      const updatedPost = {
        ...updatedPostFromBackend,
        postedBy: oldPost.postedBy,
        comments: oldPost.comments,
      };

      setPosts((prev) =>
        prev.map((post) => (post._id === postId ? updatedPost : post))
      );
    } catch {}
  };

  const handleCommentChange = (postId, text) => {
    setCommentTexts((prev) => ({ ...prev, [postId]: text }));
  };

  const handleCommentSubmit = async (postId) => {
    const text = commentTexts[postId];
    if (!text) return;

    try {
      const res = await axios.post(
        `http://localhost:5000/tailors/posts/${postId}/comment`,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newCommentFromBackend = res.data.comment;

      const newComment = newCommentFromBackend
        ? {
            _id: newCommentFromBackend._id,
            text: newCommentFromBackend.commentText,
            userId: newCommentFromBackend.userId,
            commentedBy: { name: newCommentFromBackend.userName },
            createdAt: newCommentFromBackend.createdAt,
          }
        : {
            _id: Date.now().toString(),
            text,
            userId,
            commentedBy: { name: "You" },
            createdAt: new Date().toISOString(),
          };

      setPosts((prev) =>
        prev.map((post) =>
          post._id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );

      setCommentTexts((prev) => ({ ...prev, [postId]: "" }));
    } catch {}
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:5000/tailors/posts/${postId}/comments/${commentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPosts((prev) =>
        prev.map((post) => {
          if (post._id === postId) {
            return {
              ...post,
              comments: post.comments.filter((c) => c._id !== commentId),
            };
          }
          return post;
        })
      );
    } catch {}
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
                        setSelectedCommentId(null);
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
