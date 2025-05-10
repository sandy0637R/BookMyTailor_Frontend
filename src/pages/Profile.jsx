import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfileRequest, logout, updateProfileRequest } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const ImageUpload = ({ imageUrl, setImageUrl }) => {
  const [file, setFile] = useState();
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return toast.error("Please select a file");
    if (!file.type.startsWith("image/")) return toast.error("Only image files allowed");

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploading(true);
      const res = await axios.put("http://localhost:5000/users/profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });
      const uploadedImageUrl = `http://localhost:5000/${res.data.user.profileImage.replace(/\\/g, '/')}`;
      setImageUrl(uploadedImageUrl);
      localStorage.setItem('profileImageUrl', uploadedImageUrl);
      toast.success("Image uploaded successfully!");
    } catch (error) {
      toast.error("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await axios.delete("http://localhost:5000/users/profile/image", {
        withCredentials: true,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (res.status === 200) {
        setImageUrl('');
        localStorage.removeItem('profileImageUrl');
        toast.success("Image deleted successfully!");
      }
    } catch (error) {
      toast.error("Image deletion failed!");
    }
  };

  return (
    <div className="mb-4">
      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={handleUpload} disabled={uploading} className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md">
        {uploading ? "Uploading..." : "Submit"}
      </button>

      {/* Show delete only if image exists */}
      {imageUrl && (
        <div>
          <button
            onClick={handleDeleteImage}
            className="mt-2 ml-2 bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Delete Image
          </button>
        </div>
      )}
    </div>
  );
};

const TailorForm = ({ tailorForm, setTailorForm, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <input
      type="number"
      value={tailorForm.experience}
      min="0"
      onChange={e => setTailorForm({ ...tailorForm, experience: e.target.value })}
      placeholder="Experience"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
    <input
      type="text"
      value={tailorForm.specialization}
      onChange={e => setTailorForm({ ...tailorForm, specialization: e.target.value })}
      placeholder="Specialization (comma-separated)"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
    <input
      type="number"
      value={tailorForm.fees}
      min="0"
      onChange={e => setTailorForm({ ...tailorForm, fees: e.target.value })}
      placeholder="Fees"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
    <button type="submit" className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md">Submit</button>
  </form>
);

const TailorDetails = ({ details }) => (
  <div className="mt-6 p-4 bg-gray-100 rounded-md">
    <h3 className="text-lg font-semibold">Your Tailor Details</h3>
    <p className="mt-2">Experience: {details.experience}</p>
    <p className="mt-2">Specialization: {details.specialization?.join(', ')}</p>
    <p className="mt-2">Fees: {details.fees}</p>
  </div>
);

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.auth);

  const [imageUrl, setImageUrl] = useState('');
  const [currentRole, setCurrentRole] = useState(localStorage.getItem('role') || 'customer');
  const [showTailorConfirm, setShowTailorConfirm] = useState(false);
  const [showTailorForm, setShowTailorForm] = useState(false);
  const [tailorForm, setTailorForm] = useState({ experience: '', specialization: '', fees: '' });

  useEffect(() => {
    const savedImageUrl = localStorage.getItem('profileImageUrl');
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
    } else if (profile?.profileImage) {
      const url = `http://localhost:5000/${profile.profileImage.replace(/\\/g, '/')}`;
      console.log("Image from profile:", profile.profileImage);
      setImageUrl(url);
    }
  }, [profile]);

  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const roles = profile.roles || [];
      const hasTailor = roles.includes('tailor');
      setCurrentRole(localStorage.getItem('role') || (hasTailor ? 'tailor' : 'customer'));

      if (hasTailor && profile.tailorDetails) {
        setTailorForm({
          experience: profile.tailorDetails.experience || '',
          specialization: profile.tailorDetails.specialization?.join(', ') || '',
          fees: profile.tailorDetails.fees || ''
        });
      }

      localStorage.setItem("user", profile.name || '');
      localStorage.setItem("email", profile.email || '');
      localStorage.setItem("roles", JSON.stringify(profile.roles || ['customer']));
      localStorage.setItem("tailorDetails", JSON.stringify(profile.tailorDetails || null));
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }, [profile]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    localStorage.clear();
    navigate("/login");
  };

  const handleRoleChange = (e) => {
    const selected = e.target.value;
    if (selected === currentRole) return;

    if (selected === "tailor") {
      if (profile?.roles?.includes("tailor") && profile.tailorDetails) {
        setCurrentRole("tailor");
        localStorage.setItem("role", "tailor");
        toast.success("Switched to Tailor mode");
      } else {
        setShowTailorConfirm(true);
      }
    } else {
      dispatch(updateProfileRequest({ roles: ["customer"] }));
      setCurrentRole("customer");
      localStorage.setItem("role", "customer");
      toast.success("Switched to Customer mode");
    }
  };

  const handleTailorConfirm = (confirm) => {
    setShowTailorConfirm(false);
    if (confirm) setShowTailorForm(true);
  };

  const handleTailorFormSubmit = (e) => {
    e.preventDefault();

    const tailorDetails = {
      experience: Number(tailorForm.experience),
      specialization: tailorForm.specialization.split(',').map(s => s.trim()),
      fees: Number(tailorForm.fees),
    };

    const roles = profile?.roles?.includes("customer") ? ["customer", "tailor"] : ["tailor"];

    dispatch(updateProfileRequest({ roles, tailorDetails }));
    dispatch(fetchProfileRequest());

    toast.success("Tailor profile submitted!");
    setShowTailorForm(false);
    setCurrentRole("tailor");
    localStorage.setItem("role", "tailor");
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      {imageUrl ? (
        <img src={imageUrl} alt="Profile" className="w-32 h-32 object-cover rounded-full mb-4" />
      ) : (
        <img src='/path/to/fallback-image.jpg' alt="Profile" className="w-32 h-32 object-cover rounded-full mb-4" />
      )}

      <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />

      <p className="text-lg mb-2">Name: {profile?.name}</p>
      <p className="text-lg mb-4">Email: {profile?.email}</p>

      <div className="mb-4">
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Switch Role</label>
        <select 
          id="role" 
          value={currentRole} 
          onChange={handleRoleChange} 
          className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="customer">Customer</option>
          <option value="tailor">Tailor</option>
        </select>
      </div>

      {showTailorConfirm && (
        <div className="bg-yellow-100 p-4 mb-4 rounded-md">
          <p className="text-gray-700">Do you want to become a tailor? Please provide your details.</p>
          <div className="flex mt-2">
            <button onClick={() => handleTailorConfirm(true)} className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2">Yes</button>
            <button onClick={() => handleTailorConfirm(false)} className="bg-red-500 text-white py-2 px-4 rounded-md">No</button>
          </div>
        </div>
      )}

      {showTailorForm && (
        <TailorForm tailorForm={tailorForm} setTailorForm={setTailorForm} onSubmit={handleTailorFormSubmit} />
      )}

      {currentRole === "tailor" && profile?.roles?.includes("tailor") && profile.tailorDetails && (
        <TailorDetails details={profile.tailorDetails} />
      )}

      <button onClick={handleLogout} className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md">Logout</button>
    </div>
  );
};

export default Profile;
