import React from "react";
import axios from "axios";

const EditPostForm = ({
  post,
  token,
  fetchPosts,
  cancelEdit,
  editCaption,
  setEditCaption,
  editImages,
  setEditImages,
  editProductLink,
  setEditProductLink,
  editingPostId,
}) => {
  return (
    <div className="bg-neutral-primary p-4 rounded-xl shadow-md">
      {/* Caption */}
      <div className="mb-4">
        <label
          htmlFor="editCaption"
          className="block mb-1 font-medium text-brown-secondary"
        >
          Caption <span className="text-danger-primary">*</span>
        </label>
        <input
          id="editCaption"
          type="text"
          value={editCaption}
          onChange={(e) => setEditCaption(e.target.value)}
          className="w-full px-3 py-2 border border-yellow-secondary rounded-md 
                     focus:ring-2 focus:ring-yellow-tertiary"
        />
      </div>

      {/* Images */}
      <div className="mb-4">
        <label
          htmlFor="editImages"
          className="block mb-1 font-medium text-brown-secondary"
        >
          Upload New Images
        </label>
        <input
          id="editImages"
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setEditImages(Array.from(e.target.files))}
          className="w-full text-sm text-brown-secondary 
                     file:mr-4 file:py-2 file:px-4 
                     file:rounded-md file:border-0 
                     file:text-sm file:font-semibold 
                     file:bg-yellow-tertiary file:text-neutral-primary 
                     hover:file:bg-yellow-premium cursor-pointer"
        />
      </div>

      {/* Product Link */}
      <div className="mb-4">
        <label
          htmlFor="editProductLink"
          className="block mb-1 font-medium text-brown-secondary"
        >
          Product Link (optional)
        </label>
        <input
          id="editProductLink"
          type="text"
          value={editProductLink}
          onChange={(e) => setEditProductLink(e.target.value)}
          placeholder="http://localhost:5173/cloths/..."
          className="w-full px-3 py-2 border border-yellow-secondary rounded-md 
                     focus:ring-2 focus:ring-yellow-tertiary"
        />
      </div>

      {/* Old Images */}
      <div className="flex flex-wrap gap-4 mb-4">
        {post.images.map((imgUrl, idx) => (
          <img
            key={idx}
            src={imgUrl}
            alt="post-img"
            className="h-20 rounded-md object-cover shadow-md border border-yellow-primary"
          />
        ))}
      </div>

      {/* Preview New Images */}
      {editImages.length > 0 && (
        <div className="flex flex-wrap gap-4 mb-4">
          {editImages.map((img, idx) => (
            <img
              key={idx}
              src={URL.createObjectURL(img)}
              alt="preview"
              className="h-20 rounded-md object-cover border-2 border-yellow-tertiary shadow-md"
            />
          ))}
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-2">
        <button
          onClick={async () => {
            if (
              editProductLink &&
              !editProductLink.startsWith("http://localhost:5173/cloths/")
            ) {
              await alert(
                "If entered, product link must be a valid Book My Tailor link."
              );
              return;
            }

            const formData = new FormData();
            formData.append("caption", editCaption);
            formData.append("productLink", editProductLink);
            editImages.forEach((img) => formData.append("images", img));

            try {
              await axios.put(
                `https://bookmytailor-backend.onrender.com/users/post/${editingPostId}`,
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                  },
                }
              );
              await alert("Post updated");
              cancelEdit();
              fetchPosts();
            } catch {
              await alert("Update failed");
            }
          }}
          className="bg-yellow-tertiary text-neutral-primary px-4 py-2 rounded-md shadow-md hover:bg-yellow-premium"
        >
          Save
        </button>

        <button
          onClick={cancelEdit}
          className="bg-brown-primary text-neutral-primary px-4 py-2 rounded-md shadow-md hover:bg-brown-secondary"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditPostForm;
