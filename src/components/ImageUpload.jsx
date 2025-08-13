import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/authSlice";
import { FaEdit, FaUserCircle } from "react-icons/fa";

const ImageUpload = ({ profileImage, setProfileImage }) => {
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/"))
      return toast.error("Only image files allowed");

    if (profileImage) {
      try {
        await axios.delete("http://localhost:5000/users/profile/image", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Old image deletion failed!"
        );
      }
    }

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploading(true);
      const res = await axios.put(
        "http://localhost:5000/users/profile",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const newImagePath = res.data.user.profileImage.replace(/\\/g, "/");
      const fullUrl = `http://localhost:5000/${newImagePath}`;

      setProfileImage(fullUrl);
      dispatch(setProfile({ ...res.data.user, profileImage: newImagePath }));
      toast.success("Profile image updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed!");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="relative w-65 h-65">
      {/* Profile Image OR Default Icon */}
      {profileImage ? (
        <img
          src={profileImage}
          alt="Profile"
          className="w-65 h-65 object-cover rounded-full border-4 border-brown-primary shadow-custom  "
        />
      ) : (
        <FaUserCircle className="w-65 h-65 text-gray-400" />
      )}

      {/* Floating Edit Button */}
      <label
        htmlFor="fileInput"
        className="absolute bottom-1 right-10 bg-yellow-tertiary h-10 w-10 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-brown flex items-center justify-center"
        title="Change Profile Image"
      >
        <FaEdit />
      </label>
      <input
        id="fileInput"
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={uploading}
      />
    </div>
  );
};

export default ImageUpload;
