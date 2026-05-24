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
      const res = await axios.get("https://bookmytailor-backend.onrender.com/users/posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(res.data);
    } catch {
      alert("Failed to fetch posts");
    }
  };

  return (
  <div className="flex h-screen bg-neutral-primary">

  {/* Add Post Form (Left Panel) */}
  <div className="w-3/5 h-full overflow-y-auto flex flex-col items-center p-8 bg-[url('/assets/Creative.png')] bg-cover bg-center">
    <h2 className="text-3xl font-bold text-yellow-primary mb-8 mt-8 text-center">
      Add Post
    </h2>

    <div className="w-4/5">
      <AddPostForm fetchPosts={fetchPosts} token={token} />
    </div>
  </div>

  {/* Posts List (Right Panel) */}
  <div className="w-2/5 h-full overflow-y-auto p-8 border-l border-yellow-secondary">
    <h2 className="text-3xl font-bold text-brown-tertiary mb-8 text-center">
      All Posts
    </h2>

    <div className="w-full">
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
  </div>

</div>

  );
};

export default AddPost;
