import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProfileRequest,
  logout,
  updateProfileRequest,
} from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ImageUpload from "../components/ImageUpload";
import TailorForm from "../components/TailorForm";
import TailorDetails from "../components/TailorDetails";

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profile, loading } = useSelector((state) => state.auth);

  const [imageUrl, setImageUrl] = useState("");
  const [currentRole, setCurrentRole] = useState(
    localStorage.getItem("role") || "customer"
  );
  const [showTailorConfirm, setShowTailorConfirm] = useState(false);
  const [showTailorForm, setShowTailorForm] = useState(false);
  const [tailorForm, setTailorForm] = useState({
    experience: "",
    specialization: "",
    fees: "",
    description: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    address: "",
    experience: "",
    specialization: "",
    fees: "",
    description: "",
  });

  const isAdmin = profile?.roles?.includes("admin");

  useEffect(() => {
    const savedImageUrl = localStorage.getItem("profileImageUrl");
    if (savedImageUrl) {
      setImageUrl(savedImageUrl);
    } else if (profile?.profileImage) {
      const url = `http://localhost:5000/${profile.profileImage.replace(
        /\\/g,
        "/"
      )}`;
      setImageUrl(url);
    }
  }, [profile]);

  useEffect(() => {
    dispatch(fetchProfileRequest());
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      const roles = profile.roles || [];
      const hasTailor = roles.includes("tailor");
      

      setEditForm({
        name: profile?.name || "",
        email: profile?.email || "",
        address: profile?.address || "",
        experience: profile?.tailorDetails?.experience || "",
        specialization:
          profile?.tailorDetails?.specialization?.join(", ") || "",
        fees: profile?.tailorDetails?.fees || "",
        description: profile?.tailorDetails?.description || "",
      });

      if (hasTailor && profile.tailorDetails) {
        setTailorForm({
          experience: profile.tailorDetails.experience || "",
          specialization:
            profile.tailorDetails.specialization?.join(", ") || "",
          fees: profile.tailorDetails.fees || "",
          description: profile.tailorDetails.description || "",
        });
      }

      localStorage.setItem("user", profile.name || "");
      localStorage.setItem("email", profile.email || "");
      localStorage.setItem("roles", JSON.stringify(roles));
      localStorage.setItem(
        "tailorDetails",
        JSON.stringify(profile.tailorDetails || null)
      );
      localStorage.setItem("profile", JSON.stringify(profile));
    }
  }, [profile]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully!");
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
      specialization: tailorForm.specialization.split(",").map((s) => s.trim()),
      fees: Number(tailorForm.fees),
      description: tailorForm.description,
    };

    const roles = profile?.roles?.includes("customer")
      ? ["customer", "tailor"]
      : ["tailor"];

    dispatch(updateProfileRequest({ roles, tailorDetails }));
    dispatch(fetchProfileRequest());

    toast.success("Tailor profile submitted!");
    setShowTailorForm(false);
    setCurrentRole("tailor");
    localStorage.setItem("role", "tailor");
  };

  const handleEditSubmit = () => {
    const payload = {
      name: editForm.name,
      email: editForm.email,
      address: editForm.address,
      tailorDetails: {
        experience: Number(editForm.experience),
        specialization: editForm.specialization.split(",").map((s) => s.trim()),
        fees: Number(editForm.fees),
        description: editForm.description,
      },
    };

    dispatch(updateProfileRequest(payload));
    dispatch(fetchProfileRequest());
    toast.success("Profile updated!");
    setIsEditing(false);
    dispatch(updateProfileRequest(payload));
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-15">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>

      {imageUrl ? (
        <img
          src={imageUrl}
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full mb-4"
        />
      ) : (
        <img
          src="/path/to/fallback-image.jpg"
          alt="Profile"
          className="w-32 h-32 object-cover rounded-full mb-4"
        />
      )}

      <ImageUpload imageUrl={imageUrl} setImageUrl={setImageUrl} />

      {isEditing ? (
        <>
          <input
            className="mb-2 border px-2 py-1 w-full rounded"
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
          />
          <input
            className="mb-2 border px-2 py-1 w-full rounded"
            value={editForm.email}
            onChange={(e) =>
              setEditForm({ ...editForm, email: e.target.value })
            }
          />
          <input
            className="mb-4 border px-2 py-1 w-full rounded"
            placeholder="Address"
            value={editForm.address}
            onChange={(e) =>
              setEditForm({ ...editForm, address: e.target.value })
            }
          />
          {currentRole === "tailor" && (
            <>
              <input
                className="mb-2 border px-2 py-1 w-full rounded"
                placeholder="Experience"
                value={editForm.experience}
                onChange={(e) =>
                  setEditForm({ ...editForm, experience: e.target.value })
                }
              />
              <input
                className="mb-2 border px-2 py-1 w-full rounded"
                placeholder="Specialization"
                value={editForm.specialization}
                onChange={(e) =>
                  setEditForm({ ...editForm, specialization: e.target.value })
                }
              />
              <input
                className="mb-2 border px-2 py-1 w-full rounded"
                placeholder="Fees"
                value={editForm.fees}
                onChange={(e) =>
                  setEditForm({ ...editForm, fees: e.target.value })
                }
              />
              <textarea
                className="mb-4 border px-2 py-1 w-full rounded"
                placeholder="Description"
                value={editForm.description}
                onChange={(e) =>
                  setEditForm({ ...editForm, description: e.target.value })
                }
              />
            </>
          )}

          <div className="flex gap-2 mb-4">
            <button
              onClick={handleEditSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-lg mb-2">Name: {profile?.name}</p>
          <p className="text-lg mb-2">Email: {profile?.email}</p>
          <p className="text-lg mb-4">Address: {profile?.address || "N/A"}</p>
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Edit Profile
          </button>
        </>
      )}

      {isAdmin ? (
        <p className="text-lg mb-4">Role: Admin</p>
      ) : (
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700"
          >
            Switch Role
          </label>
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
      )}

      {showTailorConfirm && (
        <div className="bg-yellow-100 p-4 mb-4 rounded-md">
          <p className="text-gray-700">
            Do you want to become a tailor? Please provide your details.
          </p>
          <div className="flex mt-2">
            <button
              onClick={() => handleTailorConfirm(true)}
              className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2"
            >
              Yes
            </button>
            <button
              onClick={() => handleTailorConfirm(false)}
              className="bg-red-500 text-white py-2 px-4 rounded-md"
            >
              No
            </button>
          </div>
        </div>
      )}

      {showTailorForm && (
        <TailorForm
          tailorForm={tailorForm}
          setTailorForm={setTailorForm}
          onSubmit={handleTailorFormSubmit}
        />
      )}

      {currentRole === "tailor" &&
        profile?.roles?.includes("tailor") &&
        profile.tailorDetails && (
          <TailorDetails details={profile.tailorDetails} />
        )}

      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 text-white py-2 px-4 rounded-md"
      >
        Logout
      </button>
    </div>
  );
};

export default Profile;
