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
    <div style={{ maxWidth: 600, margin: "auto" }}>
      <h2>{editingPostId ? "Edit Post" : "Add Post"}</h2>
      <form onSubmit={editingPostId ? (e) => { e.preventDefault(); saveEdit(); } : handleAddPost}>
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          style={{ width: "100%", marginBottom: 10 }}
        />
        <input
          type="text"
          placeholder="Hashtags (comma separated)"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          style={{ width: "100%", marginBottom: 10 }}
        />
        {!editingPostId && (
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginBottom: 10 }}
          />
        )}
        <button type="submit">{editingPostId ? "Save Edit" : "Add Post"}</button>
        {editingPostId && (
          <button onClick={cancelEdit} style={{ marginLeft: 10 }}>
            Cancel
          </button>
        )}
      </form>

      <h2 style={{ marginTop: 40 }}>All Posts</h2>
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
          <p><b>Caption:</b> {post.caption}</p>
          <p><b>Hashtags:</b> {post.hashtags.join(", ")}</p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {post.images.map((imgUrl, idx) => (
              <img
                key={idx}
                src={imgUrl}
                alt="post-img"
                style={{ height: 80, objectFit: "cover" }}
              />
            ))}
          </div>
          <button onClick={() => startEdit(post)}>Edit</button>
          <button onClick={() => deletePost(post._id)} style={{ marginLeft: 10, color: "red" }}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default AddPost;
