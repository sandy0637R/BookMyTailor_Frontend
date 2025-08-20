import React from "react";
import axios from "axios";

const EditPostForm = ({
  post,
  token,
  fetchPosts,
  cancelEdit,
  editCaption,
  setEditCaption,
  editHashtags,
  setEditHashtags,
  editImages,
  setEditImages,
  editProductLink,
  setEditProductLink,
  editingPostId,
}) => {
  return (
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
              alert(
                "If entered, product link must be a valid Book My Tailor link."
              );
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
  );
};

export default EditPostForm;
