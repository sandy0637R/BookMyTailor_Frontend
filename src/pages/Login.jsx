import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginRequest } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, error, roleError } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const loginData = { email, password, ...(isAdminLogin && { role: "admin" }) };
    dispatch(loginRequest(loginData));
  };

  useEffect(() => {
    if (error) toast.error(error);
    if (roleError) toast.error(roleError);
  }, [error, roleError]);

  useEffect(() => {
    if (isLoggedIn) navigate(isAdminLogin ? "/admin" : "/");
  }, [isLoggedIn, isAdminLogin, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen  relative overflow-hidden bg-[url('/assets/Creative.png')] bg-center">

      <form
        onSubmit={handleSubmit}
        className="relative bg-neutral-primary p-10 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.2)] w-96 flex flex-col items-center space-y-6 transition-transform duration-500 hover:scale-105"
      >
        <h2 className="text-3xl font-extrabold text-brown-primary mb-6 tracking-wide"><span className="text-yellow-tertiary">Stich</span>Mate</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-4 rounded-xl border-2 border-brown-secondary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary transition placeholder:text-brown-tertiary"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-4 rounded-xl border-2 border-brown-secondary focus:outline-none focus:ring-2 focus:ring-yellow-tertiary transition placeholder:text-brown-tertiary"
        />

        <label className="flex items-center gap-2 w-full justify-start text-brown-primary">
          <input
            type="checkbox"
            checked={isAdminLogin}
            onChange={(e) => setIsAdminLogin(e.target.checked)}
            className="accent-yellow-tertiary"
          />
          Login as Admin
        </label>

        <button
          type="submit"
          className="w-full bg-yellow-tertiary text-brown-tertiary font-bold py-3 rounded-xl shadow-lg hover:bg-yellow-primary hover:shadow-2xl transition-all duration-300"
        >
          Login
        </button>

        <p className="text-brown-primary text-sm mt-2">
          Don't have an account?{" "}
          <Link to="/register" className="text-yellow-tertiary hover:text-yellow-primary font-semibold">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
