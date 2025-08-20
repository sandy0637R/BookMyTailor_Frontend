import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddPostForm from "../components/AddPostForm";
import PostList from "../components/PostList";

const AddPost = () => {
  const [posts, setPosts] = useState([]);
  const [editingPostId, setEditingPostId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editProductLink, setEditProductLink] = useState("");

  const token = localStorage.getItem("token");
  const navigate = useNavigate();

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-15">
      <h2 className="text-3xl font-bold text-center mb-6">Add Post</h2>

      {/* Add Post Form */}
      <AddPostForm fetchPosts={fetchPosts} token={token} />

      {/* Posts List */}
      <h2 className="text-3xl font-bold mb-6">All Posts</h2>
      <PostList
        posts={posts}
        fetchPosts={fetchPosts}
        token={token}
        navigate={navigate}
        editingPostId={editingPostId}
        setEditingPostId={setEditingPostId}
        editCaption={editCaption}
        setEditCaption={setEditCaption}
        editHashtags={editHashtags}
        setEditHashtags={setEditHashtags}
        editImages={editImages}
        setEditImages={setEditImages}
        editProductLink={editProductLink}
        setEditProductLink={setEditProductLink}
      />
    </div>
  );
};

export default AddPost;
