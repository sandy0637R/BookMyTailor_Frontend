import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const AddPost = () => {
  const [posts, setPosts] = useState([]);
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [images, setImages] = useState([]);
  const [productLink, setProductLink] = useState("");
const navigate = useNavigate();

  const [editingPostId, setEditingPostId] = useState(null);
  const [editCaption, setEditCaption] = useState("");
  const [editHashtags, setEditHashtags] = useState("");
  const [editImages, setEditImages] = useState([]);
  const [editProductLink, setEditProductLink] = useState("");

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

    if (!caption.trim()) {
    alert("Caption is required");
    return;
  }

  if (images.length === 0) {
    alert("Please upload a image.");
    return;
  }

    if (productLink && !productLink.startsWith("http://localhost:5173/cloths/")) {
      alert("If entered, product link must be a valid Book My Tailor link.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("caption", caption);
      formData.append("hashtags", hashtags);
      formData.append("productLink", productLink);
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
      setProductLink("");
      fetchPosts();
    } catch {
      alert("Add post failed");
    }
  };

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 mt-15">
      <h2 className="text-3xl font-bold text-center mb-6">Add Post</h2>
      <form onSubmit={handleAddPost} className="mb-10">
        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="text"
          placeholder="Hashtags (comma separated)"
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
        />
        <input
          type="file"
          multiple
          accept="image/*"  
          onChange={handleImageChange}
          required
          className="mb-4"
        />
        <input
          type="text"
          placeholder="Product link (optional)"
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
        >
          Add Post
        </button>
      </form>

      <h2 className="text-3xl font-bold mb-6">All Posts</h2>
      {posts.length === 0 && (
        <p className="text-center text-gray-500">No posts yet.</p>
      )}
      {posts.map((post) => (
        <div
          key={post._id}
          className="bg-white rounded-2xl shadow-md p-6 mb-6 border border-gray-200"
        >
          {editingPostId === post._id ? (
            <>
              <input
                type="text"
                value={editCaption}
                onChange={(e) => setEditCaption(e.target.value)}
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="text"
                value={editHashtags}
                onChange={(e) => setEditHashtags(e.target.value)}
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              />
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setEditImages(Array.from(e.target.files))}
                className="mb-2"
              />
              <input
                type="text"
                value={editProductLink}
                onChange={(e) => setEditProductLink(e.target.value)}
                placeholder="Product link (optional)"
                className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md"
              />
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
              <div className="flex gap-2">
                <button
                  onClick={async () => {
                    if (
                      editProductLink &&
                      !editProductLink.startsWith("http://localhost:5173/cloths/")
                    ) {
                      alert("If entered, product link must be a valid Book My Tailor link.");
                      return;
                    }
                    const formData = new FormData();
                    formData.append("caption", editCaption);
                    formData.append("hashtags", editHashtags);
                    formData.append("productLink", editProductLink);
                    editImages.forEach((img) => formData.append("images", img));

                    try {
                      await axios.put(
                        `http://localhost:5000/users/post/${editingPostId}`,
                        formData,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "multipart/form-data",
                          },
                        }
                      );
                      alert("Post updated");
                      cancelEdit();
                      fetchPosts();
                    } catch {
                      alert("Update failed");
                    }
                  }}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="bg-gray-200 px-4 py-2 rounded-md hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="text-lg font-semibold mb-2">
                <span className="text-gray-600">Caption:</span> {post.caption}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-medium">Hashtags:</span>{" "}
                {post.hashtags.join(", ")}
              </p>
{post.productLink ? (
  <button
  onClick={() => {
    const url = post.productLink.replace("http://localhost:5173", "");
    navigate(url);
  }}
  className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 mb-2"
>
  View Product
</button>

) : editingPostId !== post._id ? (
  <div className="mb-2">
    {!post.showProductLinkInput ? (
      <button
        onClick={() =>
          setPosts((prev) =>
            prev.map((p) =>
              p._id === post._id ? { ...p, showProductLinkInput: true } : p
            )
          )
        }
        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
      >
        Enter Product Link
      </button>
    ) : (
      <div className="flex gap-2 items-center mt-2">
        <input
          type="text"
          placeholder="Enter product link"
          value={editProductLink}
          onChange={(e) => setEditProductLink(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={async () => {
            if (
              editProductLink &&
              !editProductLink.startsWith("http://localhost:5173/cloths/")
            ) {
              alert("If entered, product link must be a valid Book My Tailor link.");
              return;
            }

            const formData = new FormData();
            formData.append("caption", post.caption);
            formData.append("hashtags", post.hashtags.join(", "));
            formData.append("productLink", editProductLink);

            try {
              await axios.put(
                `http://localhost:5000/users/post/${post._id}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              alert("Product link added");
              fetchPosts();
            } catch {
              alert("Failed to add product link");
            }
          }}
        >
          Submit
        </button>
      </div>
    )}
  </div>
) : null}


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
    </div>
  );
};

export default AddPost;
