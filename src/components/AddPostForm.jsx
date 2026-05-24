import React, { useState } from "react";
import axios from "axios";

const AddPostForm = ({ fetchPosts, token }) => {
  const [caption, setCaption] = useState("");
  const [hashtags, setHashtags] = useState("");
  const [images, setImages] = useState([]);
  const [productLink, setProductLink] = useState("");
  const [previewImages, setPreviewImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
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
    await alert("Product link must be a valid Book My Tailor link.");
    return;
  }

    try {
      const formattedHashtags = hashtags
        .split("#")
        .map((tag) => tag.trim())
        .filter((tag) => tag !== "")
        .map((tag) => `#${tag}`);

      const formData = new FormData();
      formData.append("caption", caption);

      formattedHashtags.forEach((tag) => {
        formData.append("hashtags", tag);
      });

      formData.append("productLink", productLink);
      images.forEach((img) => formData.append("images", img));

      await axios.post("https://bookmytailor-backend.onrender.com/users/post", formData, {
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
      setPreviewImages([]);
      fetchPosts();
    } catch {
      alert("Add post failed");
    }
  };

  return (
    <form
      onSubmit={handleAddPost}
      className="mb-10 space-y-6 p-6 bg-yellow-primary rounded-2xl shadow-md border border-yellow-tertiary"
    >
      {/* Caption */}
      <div>
        <label
          htmlFor="caption"
          className="block mb-2 font-semibold text-brown-tertiary"
        >
          Caption <span className="text-danger-primary">*</span>
        </label>
        <input
          id="caption"
          type="text"
          placeholder="Enter caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          className="w-full px-4 py-2 border-2 border-yellow-tertiary rounded-lg bg-neutral-primary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary"
        />
      </div>

      {/* Hashtags */}
      <div>
        <label
          htmlFor="hashtags"
          className="block mb-2 font-semibold text-brown-tertiary"
        >
          Hashtags
        </label>
        <input
          id="hashtags"
          type="text"
          placeholder="#hashtags..."
          value={hashtags}
          onChange={(e) => setHashtags(e.target.value)}
          className="w-full px-4 py-2 border-2 border-yellow-tertiary rounded-lg bg-neutral-primary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary"
        />
        <p className="text-sm text-brown-secondary mt-1">
          Example: <code>#summer#fashion#style</code>
        </p>
      </div>

      {/* Images */}
      <div>
        <label
          htmlFor="images"
          className="block mb-2 font-semibold text-brown-tertiary"
        >
          Upload Images <span className="text-danger-primary">*</span>
        </label>
        <input
          id="images"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
          required
          className=" text-neutral-primary bg-yellow-tertiary p-2 rounded w-fit hover:bg-yellow-premium"
        />
      </div>

      {/* ✅ Image Preview */}
      {previewImages.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-4">
          {previewImages.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt="preview"
              className="w-24 h-24 object-cover rounded-lg border-2 border-yellow-tertiary shadow-sm"
            />
          ))}
        </div>
      )}

      {/* Product Link */}
      <div>
        <label
          htmlFor="productLink"
          className="block mb-2 font-semibold text-brown-tertiary"
        >
          Product Link (optional)
        </label>
        <input
          id="productLink"
          type="text"
          placeholder="http://localhost:5173/cloths/..."
          value={productLink}
          onChange={(e) => setProductLink(e.target.value)}
          className="w-full px-4 py-2 border-2 border-yellow-tertiary rounded-lg bg-neutral-primary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        className="w-full bg-brown-primary text-neutral-primary font-semibold px-6 py-3 rounded-xl shadow-md hover:bg-brown-secondary transition duration-200"
      >
        Add Post
      </button>
    </form>
  );
};

export default AddPostForm;
