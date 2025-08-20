import React, { useState } from "react";
import axios from "axios";

const AddPostForm = ({ fetchPosts, token }) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [images, setImages] = useState([]);
  const [productLink, setProductLink] = useState("");

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

  return (
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
  );
};

export default AddPostForm;
