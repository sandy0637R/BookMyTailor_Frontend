import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Customize = () => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({
    gender: "",
    measurements: {},
    budget: "",
    duration: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [editingId, setEditingId] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequests(res.data.customDressRequests || []);
    } catch (err) {
      toast.error("Failed to load requests");
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("measurements.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        measurements: { ...prev.measurements, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    setForm((prev) => ({ ...prev, image: file }));
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      fd.append("gender", form.gender);
      fd.append("budget", form.budget);
      fd.append("duration", form.duration);
      fd.append("description", form.description);
      fd.append("image", form.image);
      fd.append("measurements", JSON.stringify(form.measurements));

      await axios.post("http://localhost:5000/custom/request", fd, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success("Request submitted");
      setForm({
        gender: "",
        measurements: {},
        budget: "",
        duration: "",
        description: "",
        image: null,
      });
      setPreview(null);
      fetchRequests();
    } catch (err) {
      toast.error("Submit failed");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/custom/request/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchRequests();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleConfirm = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/custom/request/${id}/confirm`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Delivery confirmed");
      fetchRequests();
    } catch {
      toast.error("Confirmation failed");
    }
  };

  const handleEditChange = (e, id, key) => {
    const value = e.target.value;
    setRequests((prev) =>
      prev.map((r) => (r._id === id ? { ...r, [key]: value } : r))
    );
  };

  const handleEditMeasurementsChange = (e, id, part) => {
    const value = e.target.value;
    setRequests((prev) =>
      prev.map((r) =>
        r._id === id
          ? {
              ...r,
              measurements: {
                ...r.measurements,
                [part]: value,
              },
            }
          : r
      )
    );
  };

  const handleEditFile = (e, id) => {
    const file = e.target.files[0];
    if (!file) return;
    setRequests((prev) =>
      prev.map((r) =>
        r._id === id
          ? { ...r, image: file, imagePreview: URL.createObjectURL(file) }
          : r
      )
    );
  };

  const handleEditSubmit = async (req) => {
    try {
      const fd = new FormData();
      fd.append("gender", req.gender);
      fd.append("budget", req.budget);
      fd.append("duration", req.duration);
      fd.append("description", req.description);
      fd.append("measurements", JSON.stringify(req.measurements));
      if (req.image instanceof File) fd.append("image", req.image);

      await axios.put(`http://localhost:5000/custom/request/${req._id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Request updated");
      setEditingId(null);
      fetchRequests();
    } catch {
      toast.error("Update failed");
    }
  };

  const isSubmitDisabled =
    !form.gender || !form.budget || !form.duration || !form.image || !form.measurements;

  const renderTrackingStatus = (status) => {
    const steps = [
      "Uploaded",
      "Accepted",
      "Ready",
      "Shipped",
      "Delivered",
      "Confirmed",
    ];
    const currentIndex = steps.indexOf(status);
    return (
      <div className="flex flex-col text-sm text-gray-700 mt-2">
        <b>Tracking:</b>
        <ul className="pl-4 list-disc">
          {steps.map((step, index) => (
            <li
              key={index}
              className={
                index <= currentIndex ? "text-green-600 font-semibold" : "text-gray-400"
              }
            >
              {step}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  if (role !== "customer") {
    return (
      <div className="p-4 text-red-600">
        You are not authorized to view this page.
      </div>
    );
  }
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Upload Custom Request</h2>

      <div className="grid grid-cols-1 gap-2">
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />}
        <select name="gender" onChange={handleInput} value={form.gender}>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <input name="budget" placeholder="Budget" onChange={handleInput} value={form.budget} />
        <input
          name="duration"
          placeholder="Duration (e.g. 7 days)"
          onChange={handleInput}
          value={form.duration}
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleInput}
          value={form.description}
        />
        <input
          name="measurements.chest"
          placeholder="Chest"
          onChange={handleInput}
          value={form.measurements.chest || ""}
        />
        <input
          name="measurements.waist"
          placeholder="Waist"
          onChange={handleInput}
          value={form.measurements.waist || ""}
        />
        <input
          name="measurements.hip"
          placeholder="Hip"
          onChange={handleInput}
          value={form.measurements.hip || ""}
        />
        <input
          name="measurements.bust"
          placeholder="Bust"
          onChange={handleInput}
          value={form.measurements.bust || ""}
        />
        <button
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>

      <h2 className="text-xl font-bold mt-8 mb-2">My Requests</h2>
      {requests.map((req) => (
        <div key={req._id} className="border p-3 my-2 rounded shadow">
          {editingId === req._id ? (
            <>
              <select value={req.gender} onChange={(e) => handleEditChange(e, req._id, "gender")}>
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <input
                value={req.budget}
                onChange={(e) => handleEditChange(e, req._id, "budget")}
                placeholder="Budget"
              />
              <input
                value={req.duration}
                onChange={(e) => handleEditChange(e, req._id, "duration")}
                placeholder="Duration"
              />
              <textarea
                value={req.description}
                onChange={(e) => handleEditChange(e, req._id, "description")}
              />
              <input
                value={req.measurements?.chest || ""}
                onChange={(e) => handleEditMeasurementsChange(e, req._id, "chest")}
                placeholder="Chest"
              />
              <input
                value={req.measurements?.waist || ""}
                onChange={(e) => handleEditMeasurementsChange(e, req._id, "waist")}
                placeholder="Waist"
              />
              <input
                value={req.measurements?.hip || ""}
                onChange={(e) => handleEditMeasurementsChange(e, req._id, "hip")}
                placeholder="Hip"
              />
              <input
                value={req.measurements?.bust || ""}
                onChange={(e) => handleEditMeasurementsChange(e, req._id, "bust")}
                placeholder="Bust"
              />
              <input type="file" onChange={(e) => handleEditFile(e, req._id)} />
              {req.imagePreview && (
                <img src={req.imagePreview} className="w-32 h-32 object-cover" alt="preview" />
              )}
              <button onClick={() => handleEditSubmit(req)} className="text-green-600">
                Save
              </button>
              <button onClick={() => setEditingId(null)} className="text-gray-600 ml-2">
                Cancel
              </button>
            </>
          ) : (
            <>
              <p>
                <b>Status:</b> {req.status}
              </p>
              <p>
                <b>Budget:</b> ₹{req.budget}
              </p>
              <p>
                <b>Duration:</b> {req.duration}
              </p>
              <p>
                <b>Gender:</b> {req.gender}
              </p>
              {req.image && (
                <img
                  src={
                    typeof req.image === "string"
                      ? `http://localhost:5000/uploads/customRequests/${req.image}`
                      : URL.createObjectURL(req.image)
                  }
                  alt="Dress"
                  className="w-32 h-32 object-cover"
                />
              )}
              {renderTrackingStatus(req.status)}
              {(req.status === "Shipped" || req.status === "Delivered") && (
                <div className="text-sm mt-1">
                  <b>Tracking ID:</b> {req.trackingId || "N/A"} <br />
                  <b>Courier:</b> {req.courier || "N/A"}
                </div>
              )}
              {req.status === "Uploaded" && (
                <>
                  <button onClick={() => handleDelete(req._id)} className="text-red-600">
                    Delete
                  </button>
                  <button onClick={() => setEditingId(req._id)} className="text-blue-600 ml-4">
                    Edit
                  </button>
                </>
              )}
              {req.status === "Delivered" && (
                <button onClick={() => handleConfirm(req._id)} className="text-green-600">
                  Confirm Delivery
                </button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
};

export default Customize;
