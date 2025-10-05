import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    wishlist: [],
    orders: [],
  });

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:5000/users/admin-exists");
        if (!res.data.exists) {
          setShowRoleSelect(true);
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

    if (formData.role === "admin") {
      formData.roles = ["admin"];
    } else {
      formData.roles = ["customer"];
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
    <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-[url('/assets/Creative.png')] bg-center">
      <form
        onSubmit={handleSubmit}
        className="relative bg-neutral-primary p-10 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] w-96 flex flex-col items-center space-y-6 transition-transform duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-extrabold text-brown-primary mb-6 tracking-wide">
          <span className="text-yellow-tertiary">Stich</span>Mate
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-xl border-2 border-brown-secondary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary transition placeholder:text-brown-tertiary"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-xl border-2 border-brown-secondary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary transition placeholder:text-brown-tertiary"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full p-4 rounded-xl border-2 border-brown-secondary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary transition placeholder:text-brown-tertiary"
        />

        {showRoleSelect && (
          <select
            name="role"
            value={formData.role}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, role: e.target.value }))
            }
            className="w-full p-4 rounded-xl border-2 border-brown-secondary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary transition text-brown-primary"
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        )}

        <button
          type="submit"
          className="w-full bg-yellow-tertiary text-brown-tertiary font-bold py-3 rounded-xl shadow-lg hover:bg-yellow-primary hover:shadow-2xl transition-all duration-300"
        >
          Register
        </button>

        <p className="text-brown-primary text-sm mt-2">
          Do you have an account?{" "}
          <Link to="/login" className="text-yellow-tertiary hover:text-yellow-primary font-semibold">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Register;
