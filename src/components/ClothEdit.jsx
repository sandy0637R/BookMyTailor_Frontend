import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateClothRequest } from "../redux/clothSlice";

const ClothEdit = ({ cloth, onCancel }) => {
  const dispatch = useDispatch();
  const [editFormData, setEditFormData] = useState({
    name: "", // added
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
      name: cloth.name || "", // added
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
    <form onSubmit={handleEditSubmit} className="grid gap-2">
      <input
        name="name"
        value={editFormData.name}
        onChange={handleChange}
        placeholder="Cloth Name"
        required
        className="border p-2 rounded"
      />
      <input
        name="type"
        value={editFormData.type}
        onChange={handleChange}
        placeholder="Type"
        required
        className="border p-2 rounded"
      />
      <input
        name="price"
        type="number"
        value={editFormData.price}
        onChange={handleChange}
        placeholder="Price"
        required
        className="border p-2 rounded"
      />
      <input
        name="size"
        value={editFormData.size.join(",")}
        onChange={handleChange}
        placeholder="Sizes"
        className="border p-2 rounded"
      />
      <select
        name="gender"
        value={editFormData.gender}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Unisex">Unisex</option>
      </select>
      <input
        type="file"
        name="image"
        onChange={handleChange}
        accept="image/*"
        className="border p-2 rounded"
      />
      {editImagePreview && (
        <img
          src={editImagePreview}
          alt="Preview"
          className="h-40 object-cover rounded"
        />
      )}
      <textarea
        name="description"
        value={editFormData.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 rounded"
      />
      <div className="flex gap-2 mt-2">
        <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">
          Update
        </button>
        <button type="button" onClick={onCancel} className="bg-gray-300 px-3 py-1 rounded">
          Cancel
        </button>
      </div>
    </form>
  );
};

export default ClothEdit;
