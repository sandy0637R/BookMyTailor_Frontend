import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer", // default role is customer
    wishlist: [],
    orders: [],
  });

  // 🔍 Check if admin exists
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/admin-exists");
        if (!res.data.exists) {
          setShowRoleSelect(true); // show role select if admin doesn't exist
        }
      } catch (err) {
        console.log(err);
      }
    };
    checkAdmin();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    // Ensure roles is set correctly
    if (formData.role === "admin") {
      formData.roles = ["admin"]; // Only admin role if selected
    } else {
      formData.roles = ["customer"]; // Default to customer
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/users/register",
        formData,
        { withCredentials: true }
      );
      toast.success("Registered successfully!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          {showRoleSelect && (
            <select
              name="role"
              value={formData.role} // Corrected to 'role' instead of 'roles'
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, role: e.target.value })) // Changed to update 'role'
              }
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <option value="customer">Customer</option>
              <option value="admin">Admin</option>
            </select>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-xl hover:bg-blue-600 transition duration-300"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
