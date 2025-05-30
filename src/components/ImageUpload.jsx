import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/authSlice";

const ImageUpload = ({ profileImage, setProfileImage }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const dispatch = useDispatch();

  const handleUpload = async () => {
    if (!file) return toast.error("Please select an image file");
    if (!file.type.startsWith("image/")) return toast.error("Only image files allowed");

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      setUploading(true);
      const res = await axios.put("http://localhost:5000/users/profile", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const newImagePath = res.data.user.profileImage.replace(/\\/g, "/");
      const fullUrl = `http://localhost:5000/${newImagePath}`;

      // Update profile image via prop setter
      setProfileImage(fullUrl);

      // Update Redux store
      dispatch(setProfile({ ...res.data.user, profileImage: newImagePath }));

      setFile(null);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteImage = async () => {
    try {
      const res = await axios.delete("http://localhost:5000/users/profile/image", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (res.status === 200) {
        setProfileImage("");
        dispatch(setProfile({ ...res.data.user, profileImage: "" }));
        toast.success("Image deleted successfully!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Image deletion failed!");
    }
  };

  return (
    <div className="mb-4">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files[0])}
      />
      <button
        onClick={handleUpload}
        disabled={uploading}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
      >
        {uploading ? "Uploading..." : "Submit"}
      </button>

      {profileImage && (
        <div className="mt-4">
          <img
            src={profileImage}
            alt="Profile"
            className="w-32 h-32 object-cover rounded-full border"
          />
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

export default ImageUpload;
