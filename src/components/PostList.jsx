import React, { useState, useEffect } from "react";
import EditPostForm from "./EditPostForm";
import axios from "axios";

const PostList = ({
  posts,
  fetchPosts,
  token,
  navigate,
  editingPostId,
  setEditingPostId,
  editCaption,
  setEditCaption,
  editHashtags,
  setEditHashtags,
  editImages,
  setEditImages,
  editProductLink,
  setEditProductLink,
}) => {
  const [expandedCaptions, setExpandedCaptions] = useState({});
  const [expandedHashtags, setExpandedHashtags] = useState({});
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleCaption = (id) =>
    setExpandedCaptions((prev) => ({ ...prev, [id]: !prev[id] }));

  const toggleHashtags = (id) =>
    setExpandedHashtags((prev) => ({ ...prev, [id]: !prev[id] }));

  const startEdit = (post) => {
    setEditingPostId(post._id);
    setEditCaption(post.caption);
    setEditHashtags(post.hashtags.join(", "));
    setEditImages([]);
    setEditProductLink(post.productLink || "");
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditCaption("");
    setEditHashtags("");
    setEditImages([]);
    setEditProductLink("");
  };

const deletePost = async (postId) => {
  const confirmed = await new Promise((resolve) => {
    resolve(window.confirm("Delete this post?"));
  });
  if (!confirmed) return;

  try {
    await axios.delete(`https://bookmytailor-backend.onrender.com/users/post/${postId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    await new Promise((resolve) => {
      alert("Post deleted");
      resolve();
    });
    fetchPosts();
  } catch {
    await new Promise((resolve) => {
      alert("Delete failed");
      resolve();
    });
  }
};

  if (posts.length === 0) {
    return <p className="text-center text-brown-tertiary">No posts yet.</p>;
  }

  return (
    <>
      {posts.map((post) => {
        const caption = post.caption;
        const hashtags = post.hashtags.join(" ");
        const isCaptionLong = caption.length > 20;
        const isHashtagsLong = hashtags.length > 20;

        return (
          <div
            key={post._id}
            className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200"
          >
            {editingPostId === post._id ? (
              <EditPostForm
                post={post}
                token={token}
                fetchPosts={fetchPosts}
                cancelEdit={cancelEdit}
                editCaption={editCaption}
                setEditCaption={setEditCaption}
                editHashtags={editHashtags}
                setEditHashtags={setEditHashtags}
                editImages={editImages}
                setEditImages={setEditImages}
                editProductLink={editProductLink}
                setEditProductLink={setEditProductLink}
                editingPostId={editingPostId}
              />
            ) : (
              <>
                {/* Images */}
                <div className="w-full h-[200px] flex justify-center items-center mb-4 bg-yellow-100 shadow-inner rounded-md overflow-hidden">
                  {post.images.map((imgUrl, idx) => (
                    <img
                      key={idx}
                      src={imgUrl}
                      alt="post-img"
                      className="max-h-full max-w-full object-contain"
                    />
                  ))}
                </div>

                {/* Caption */}
                <p className="text-lg font-semibold mb-2 break-words whitespace-pre-wrap">
                  <span className="text-brown-secondary">Caption:</span>{" "}
                  {isCaptionLong && !expandedCaptions[post._id]
                    ? caption.slice(0, 20) + "..."
                    : caption}
                  {isCaptionLong && (
                    <button
                      onClick={() => toggleCaption(post._id)}
                      className="block mt-1 text-brown-primary text-sm hover:underline"
                    >
                      {expandedCaptions[post._id] ? "Show less" : "Show more"}
                    </button>
                  )}
                </p>

                {/* Hashtags */}
                <p className="text-sm text-brown-tertiary mb-2 break-words whitespace-pre-wrap">
                  <span className="font-medium">Hashtags:</span>{" "}
                  {isHashtagsLong && !expandedHashtags[post._id]
                    ? hashtags.slice(0, 20) + "..."
                    : hashtags}
                  {isHashtagsLong && (
                    <button
                      onClick={() => toggleHashtags(post._id)}
                      className="block mt-1 text-brown-primary text-sm hover:underline"
                    >
                      {expandedHashtags[post._id] ? "Show less" : "Show more"}
                    </button>
                  )}
                </p>


                {/* Date */}
                <p className="text-sm text-gray-500 mb-4">
                  <span className="font-medium text-brown-tertiary">
                    Posted on:
                  </span>{" "}
                  {new Date(post.createdAt).toLocaleDateString()}{" "}
                  {new Date(post.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => startEdit(post)}
                    className="bg-yellow-tertiary text-neutral-primary px-4 py-2 rounded-md shadow-md hover:bg-yellow-premium"
                    >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="bg-brown-primary text-neutral-primary px-4 py-2 rounded-md shadow-md hover:bg-brown-secondary"
                    >
                    Delete
                  </button>
                    {/* Product Link */}
                    {post.productLink && (
                      <button
                        onClick={() => {
                          const url = post.productLink.replace(
                            "http://localhost:5173",
                            ""
                          );
                          navigate(url);
                        }}
                        className="bg-brown-secondary text-neutral-primary px-4 py-2 rounded-md shadow-md hover:bg-brown-secondary"
                      >
                        View Product
                      </button>
                    )}
                </div>
              </>
            )}
          </div>
        );
      })}
    </>
  );
};

export default PostList;
