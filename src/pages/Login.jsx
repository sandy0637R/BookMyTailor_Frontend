import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginRequest } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoggedIn, error, roleError } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
      ...(isAdminLogin && { role: 'admin' })
    };

    dispatch(loginRequest(loginData));
  };

  // Handle notifications in useEffect
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    if (roleError) {
      toast.error(roleError);
    }
  }, [error, roleError]);

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border rounded"
        />

        <div className="mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={isAdminLogin}
              onChange={(e) => setIsAdminLogin(e.target.checked)}
              className="accent-blue-500"
            />
            <span>Login as Admin</span>
          </label>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
