import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addClothRequest } from "../redux/clothSlice";

const ClothForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "", 
    type: "",
    size: ["S", "M", "L", "XL"],
    gender: "Unisex",
    price: "",
    description: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "size") {
      setFormData({ ...formData, size: value.split(",") });
    } else if (name === "image") {
      const file = files[0];
      setFormData({ ...formData, image: file });
      setImagePreview(URL.createObjectURL(file));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addClothRequest(formData));
    setFormData({
      name: "",
      type: "",
      size: ["S", "M", "L", "XL"],
      gender: "Unisex",
      price: "",
      description: "",
      image: null,
    });
    setImagePreview(null);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-neutral-primary p-6 rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 gap-5 max-w-3xl mx-auto"
    >
      {/* Cloth Name */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Cloth Name</label>
        <input
          name="name"
          value={formData.name}
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
          value={formData.type}
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
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Size */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Sizes (comma-separated)</label>
        <input
          name="size"
          value={formData.size.join(",")}
          onChange={handleChange}
          placeholder="S,M,L,XL"
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Gender */}
      <div className="flex flex-col">
        <label className="mb-1 font-semibold text-brown-primary">Gender</label>
        <select
          name="gender"
          value={formData.gender}
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
        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="col-span-full h-44 object-cover rounded-xl shadow-md mt-2"
          />
        )}
      </div>

      {/* Description */}
      <div className="flex flex-col col-span-full">
        <label className="mb-1 font-semibold text-brown-primary">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="p-3 rounded-lg border border-yellow-tertiary text-brown-tertiary shadow-sm focus:outline-yellow-secondary"
        />
      </div>

      {/* Add Button */}
      <div className="col-span-full flex justify-end mt-2">
        <button
          type="submit"
          className="bg-yellow-tertiary text-brown-tertiary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-secondary transition-colors duration-200"
        >
          Add Cloth
        </button>
      </div>
    </form>
  );
};

export default ClothForm;
