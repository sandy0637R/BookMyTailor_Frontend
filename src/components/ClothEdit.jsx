import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateClothRequest } from "../redux/clothSlice";

const ClothEdit = ({ cloth, onCancel }) => {
  const dispatch = useDispatch();
  const [editFormData, setEditFormData] = useState({
    name: "", 
    type: "",
    size: [],
    gender: "Unisex",
    price: "",
    description: "",
    image: null,
  });
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    setEditFormData({
      name: cloth.name || "", 
      type: cloth.type || "",
      size: cloth.size || [],
      gender: cloth.gender || "Unisex",
      price: cloth.price || "",
      description: cloth.description || "",
      image: null,
    });
    setEditImagePreview(
      cloth.image?.startsWith("/uploads") ? `http://localhost:5000${cloth.image}` : null
    );
  }, [cloth]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "size") {
      setEditFormData({ ...editFormData, size: value.split(",") });
    } else if (name === "image") {
      const file = files[0];
      setEditFormData({ ...editFormData, image: file });
      setEditImagePreview(URL.createObjectURL(file));
    } else {
      setEditFormData({ ...editFormData, [name]: value });
    }
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    dispatch(updateClothRequest({ id: cloth._id, data: editFormData }));
    onCancel();
  };

  return (
    <form 
      onSubmit={handleEditSubmit} 
      className="bg-neutral-primary p-6 rounded-2xl shadow-lg grid gap-5 max-w-lg mx-auto"
    >
      {/* Cloth Name */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Cloth Name</label>
        <input
          name="name"
          value={editFormData.name}
          onChange={handleChange}
          placeholder="Cloth Name"
          required
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Type */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Type</label>
        <input
          name="type"
          value={editFormData.type}
          onChange={handleChange}
          placeholder="Type"
          required
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Price */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Price (₹)</label>
        <input
          name="price"
          type="number"
          value={editFormData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Size */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Sizes (comma separated)</label>
        <input
          name="size"
          value={editFormData.size.join(",")}
          onChange={handleChange}
          placeholder="Sizes"
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Gender</label>
        <select
          name="gender"
          value={editFormData.gender}
          onChange={handleChange}
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        >
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Unisex">Unisex</option>
        </select>
      </div>

      {/* Image */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Upload Image</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          accept="image/*"
          className="p-2 rounded-lg border border-yellow-tertiary shadow-sm"
        />
        {editImagePreview && (
          <img
            src={editImagePreview}
            alt="Preview"
            className="h-44 object-cover rounded-xl shadow-md mt-2"
          />
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Description</label>
        <textarea
          name="description"
          value={editFormData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-4 mt-2 justify-end">
        <button 
          type="submit" 
          className="bg-yellow-tertiary text-brown-tertiary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-secondary transition-colors duration-200"
        >
          Update
        </button>
        <button 
          type="button" 
          onClick={onCancel} 
          className="bg-danger-primary text-neutral-primary px-6 py-2 rounded-lg font-semibold hover:bg-danger-secondary transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ClothEdit;
