import React from "react";
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
    if (!window.confirm("Delete this post?")) return;
    try {
      await axios.delete(`http://localhost:5000/users/post/${postId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post deleted");
      fetchPosts();
    } catch {
      alert("Delete failed");
    }
  };

  if (posts.length === 0) {
    return <p className="text-center text-gray-500">No posts yet.</p>;
  }

  return (
    <>
      {posts.map((post) => (
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
              <p className="text-lg font-semibold mb-2">
                <span className="text-gray-600">Caption:</span> {post.caption}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Hashtags:</span>{" "}
                {post.hashtags.join(", ")}
              </p>

              {/* Product Link Section */}
              {post.productLink ? (
                <button
                  onClick={() => {
                    const url = post.productLink.replace(
                      "http://localhost:5173",
                      ""
                    );
                    navigate(url);
                  }}
                  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mb-2"
                >
                  View Product
                </button>
              ) : (
                <></>
              )}

              <p className="text-sm text-gray-500 mb-4">
                <span className="font-medium">Posted on:</span>{" "}
                {new Date(post.createdAt).toLocaleDateString()}{" "}
                {new Date(post.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>

              <div className="flex flex-wrap gap-4 mb-4">
                {post.images.map((imgUrl, idx) => (
                  <img
                    key={idx}
                    src={imgUrl}
                    alt="post-img"
                    className="h-20 rounded-md object-cover"
                  />
                ))}
              </div>

              <button
                onClick={() => startEdit(post)}
                className="bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={() => deletePost(post._id)}
                className="ml-4 px-4 py-2 rounded-md text-red-600 border border-red-600 hover:bg-red-100 transition-colors"
              >
                Delete
              </button>
            </>
          )}
        </div>
      ))}
    </>
  );
};

export default PostList;
