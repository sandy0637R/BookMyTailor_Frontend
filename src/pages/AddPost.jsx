import React, { useState, useEffect } from "react";
import axios from "axios";

const AddPost = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [images, setImages] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch {
      alert("Failed to fetch posts");
    }
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleAddPost = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("hashtags", hashtags);
      images.forEach((img) => formData.append("images", img));

      await axios.post("http://localhost:5000/users/post", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Post added");
      setCaption("");
      setHashtags("");
      setImages([]);
      fetchPosts();
    } catch {
      alert("Add post failed");
    }
  };

  const startEdit = (post) => {
    setEditingPostId(post._id);
    setCaption(post.caption);
    setHashtags(post.hashtags.join(", "));
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setCaption("");
    setHashtags("");
    setImages([]);
  };

  const saveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:5000/users/post/${editingPostId}`,
        {
          caption,
          hashtags: hashtags.split(",").map((tag) => tag.trim()),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Post updated");
      cancelEdit();
      fetchPosts();
    } catch {
      alert("Update failed");
    }
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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-15">
      <h2 className="text-3xl font-bold text-center mb-6">{editingPostId ? "Edit Post" : "Add Post"}</h2>
      <form
        onSubmit={editingPostId ? (e) => { e.preventDefault(); saveEdit(); } : handleAddPost}
        className="mb-10"
      >
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="text"
          placeholder="Hashtags (comma separated)"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {!editingPostId && (
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="mb-4"
          />
        )}
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          {editingPostId ? "Save Edit" : "Add Post"}
        </button>
        {editingPostId && (
          <button
            onClick={cancelEdit}
            className="ml-4 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        )}
      </form>

      <h2 className="text-3xl font-bold mb-6">All Posts</h2>
      {posts.length === 0 && <p className="text-center text-gray-500">No posts yet.</p>}
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200"
        >
          <p className="text-lg font-semibold mb-2">
            <span className="text-gray-600">Caption:</span> {post.caption}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Hashtags:</span> {post.hashtags.join(", ")}
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
        </div>
      ))}
    </div>
  );
};

export default AddPost;
