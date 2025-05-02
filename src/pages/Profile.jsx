import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileRequest, logout, updateProfileRequest } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoggedIn, profile, loading, error } = useSelector((state) => state.auth);

  const [selectedRole, setSelectedRole] = useState("Customer");

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (profile === null) {
      dispatch(fetchProfileRequest());
    } else if (profile.role) {
      setSelectedRole(profile.role);
    }
  }, [dispatch, profile, isLoggedIn, navigate]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setSelectedRole(newRole);
    dispatch(updateProfileRequest({ role: newRole }));
    toast.success(`Role updated to ${newRole}`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div className="profile-container p-6 bg-gray-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>
      {profile ? (
        <div className="profile-info space-y-4">
          <p><strong>Name:</strong> {profile.name || 'N/A'}</p>
          <p><strong>Email:</strong> {profile.email || 'N/A'}</p>

          <div>
            <label className="font-semibold mr-2">Role:</label>
            <select
              value={selectedRole}
              onChange={handleRoleChange}
              className="border p-2 rounded"
            >
              <option value="Customer">Customer</option>
              <option value="Tailor">Tailor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
      ) : (
        <p>No profile data available</p>
      )}

      <button
        onClick={handleLogout}
        className="mt-6 w-full py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
