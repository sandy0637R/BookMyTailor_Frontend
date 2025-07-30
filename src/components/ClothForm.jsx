import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addClothRequest } from "../redux/clothSlice";

const ClothForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
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
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
      <input name="type" value={formData.type} onChange={handleChange} placeholder="Type" required className="border p-2 rounded" />
      <input name="price" type="number" value={formData.price} onChange={handleChange} placeholder="Price" required className="border p-2 rounded" />
      <input name="size" value={formData.size.join(",")} onChange={handleChange} placeholder="Sizes (comma-separated)" className="border p-2 rounded" />
      <select name="gender" value={formData.gender} onChange={handleChange} className="border p-2 rounded">
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Unisex">Unisex</option>
      </select>
      <input type="file" name="image" onChange={handleChange} accept="image/*" className="border p-2 rounded" />
      {imagePreview && <img src={imagePreview} alt="Preview" className="col-span-full h-40 object-cover rounded" />}
      <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded col-span-full" />
      <div className="col-span-full flex gap-4">
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add</button>
      </div>
    </form>
  );
};

export default ClothForm;
