import axios from 'axios';
import { useState} from "react";
import toast from 'react-hot-toast';

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

export default ImageUpload