import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ClothForm = () => {
  const [cloths, setCloths] = useState([]);
  const [editClothId, setEditClothId] = useState(null);
  const [formData, setFormData] = useState({
    type: "",
    size: ["S", "M", "L", "XL"],
    gender: "Unisex",
    price: "",
    description: "",
    image: null,
  });
  const [editFormData, setEditFormData] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);

  useEffect(() => {
    fetchCloths();
  }, []);

  const fetchCloths = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/cloths/my-cloths", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCloths(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch cloths.");
    }
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value, files } = e.target;
    if (isEdit) {
      if (name === "size") {
        setEditFormData({ ...editFormData, size: value.split(",") });
      } else if (name === "image") {
        const file = files[0];
        setEditFormData({ ...editFormData, image: file });
        setEditImagePreview(URL.createObjectURL(file));
      } else {
        setEditFormData({ ...editFormData, [name]: value });
      }
    } else {
      if (name === "size") {
        setFormData({ ...formData, size: value.split(",") });
      } else if (name === "image") {
        const file = files[0];
        setFormData({ ...formData, image: file });
        setImagePreview(URL.createObjectURL(file));
      } else {
        setFormData({ ...formData, [name]: value });
      }
    }
  };

  const resetForm = () => {
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

  const resetEditForm = () => {
    setEditClothId(null);
    setEditFormData({});
    setEditImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const user = JSON.parse(localStorage.getItem("profile"));
      const form = new FormData();

      Object.entries(formData).forEach(([key, val]) => {
        if (key === "size") val.forEach((s) => form.append("size", s));
        else if (val) form.append(key, val);
      });

      if (user?.name) {
        form.set("name", user.name);
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.post("http://localhost:5000/cloths", form, config);
      toast.success("Cloth added successfully!");
      resetForm();
      fetchCloths();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error submitting cloth.");
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const form = new FormData();

      Object.entries(editFormData).forEach(([key, val]) => {
        if (key === "size") val.forEach((s) => form.append("size", s));
        else if (val) form.append(key, val);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      await axios.put(`http://localhost:5000/cloths/${editClothId}`, form, config);
      toast.success("Cloth updated successfully!");
      resetEditForm();
      fetchCloths();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating cloth.");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/cloths/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Cloth deleted successfully!");
      fetchCloths();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed.");
    }
  };

  const handleEdit = (cloth) => {
    setEditClothId(cloth._id);
    setEditFormData({
      type: cloth.type || "",
      size: cloth.size || [],
      gender: cloth.gender || "Unisex",
      price: cloth.price || "",
      description: cloth.description || "",
      image: null,
    });
    setEditImagePreview(cloth.image?.startsWith("/uploads") ? `http://localhost:5000${cloth.image}` : null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Add Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow-md mb-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
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

      {/* Cloth Cards */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-4">
        {cloths.map((cloth) => (
          <div key={cloth._id} className="bg-white rounded shadow-md p-4">
            {editClothId === cloth._id ? (
              // Edit Form
              <form onSubmit={handleEditSubmit} className="grid gap-2">
                <input name="type" value={editFormData.type} onChange={(e) => handleChange(e, true)} placeholder="Type" required className="border p-2 rounded" />
                <input name="price" type="number" value={editFormData.price} onChange={(e) => handleChange(e, true)} placeholder="Price" required className="border p-2 rounded" />
                <input name="size" value={editFormData.size.join(",")} onChange={(e) => handleChange(e, true)} placeholder="Sizes (comma-separated)" className="border p-2 rounded" />
                <select name="gender" value={editFormData.gender} onChange={(e) => handleChange(e, true)} className="border p-2 rounded">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Unisex">Unisex</option>
                </select>
                <input type="file" name="image" onChange={(e) => handleChange(e, true)} accept="image/*" className="border p-2 rounded" />
                {editImagePreview && <img src={editImagePreview} alt="Preview" className="h-40 object-cover rounded" />}
                <textarea name="description" value={editFormData.description} onChange={(e) => handleChange(e, true)} placeholder="Description" className="border p-2 rounded" />
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-blue-500 text-white px-3 py-1 rounded">Update</button>
                  <button type="button" onClick={resetEditForm} className="bg-gray-300 px-3 py-1 rounded">Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <img
                  src={cloth.image?.startsWith("/uploads") ? `http://localhost:5000${cloth.image}` : "/placeholder.jpg"}
                  alt={cloth.name}
                  className="w-full h-40 object-cover rounded"
                />
                <h2 className="text-lg font-bold mt-2">{cloth.name}</h2>
                <p>Type: {cloth.type}</p>
                <p>Price: ₹{cloth.price}</p>
                <p>Size: {cloth.size?.join(", ")}</p>
                <p>Gender: {cloth.gender}</p>
                <p className="text-sm text-gray-600">{cloth.description}</p>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => handleEdit(cloth)} className="bg-yellow-500 text-white px-3 py-1 rounded">Edit</button>
                  <button onClick={() => handleDelete(cloth._id)} className="bg-red-500 text-white px-3 py-1 rounded">Delete</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClothForm;
