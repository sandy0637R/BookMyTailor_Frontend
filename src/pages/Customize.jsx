import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import RequestDisplayCard from "../components/RequestDisplayCard";
import RequestEditForm from "../components/RequestEditForm";
import RequestUploadForm from "../components/RequestUploadForm";


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
    quantity: "",
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
      fd.append("quantity", form.quantity);
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
        quantity: "",
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
    const maleMeasurements = [
      "chest",
      "shoulderWidth",
      "sleeveLength",
      "shirtLength",
      "neck",
      "waist",
      "hip",
      "inseam",
      "rise",
      "thigh",
    ];

    const femaleMeasurements = [
      "bust",
      "topLength",
      "waist",
      "hip",
      "inseam",
      "rise",
      "thigh",
    ];

    const requiredMeasurements =
      req.gender === "Male" ? maleMeasurements : femaleMeasurements;

    const requiredFieldsFilled = [
      req.gender,
      req.budget,
      req.duration,
      req.quantity,
      req.measurements,
    ].every(Boolean);

    const measurementsFilled = requiredMeasurements.every(
      (key) => req.measurements?.[key]
    );

    if (!requiredFieldsFilled || !measurementsFilled) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("gender", req.gender);
      fd.append("budget", req.budget);
      fd.append("duration", new Date(req.duration).toISOString()); // Fixed this line
      fd.append("description", req.description);
      fd.append("quantity", req.quantity);
      fd.append("measurements", JSON.stringify(req.measurements));
      if (req.image instanceof File) fd.append("image", req.image);

      await axios.put(`http://localhost:5000/custom/request/${req._id}`, fd, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Request updated");
      setEditingId(null);
      fetchRequests();
    } catch (err) {
      console.error("Update error:", err); // Add error logging
      toast.error("Update failed");
    }
  };
  const requiredFields = [
    form.gender,
    form.budget,
    form.duration,
    form.quantity,
    form.image,
  ];

  const requiredMeasurements =
    form.gender === "Male"
      ? [
          "chest",
          "shoulderWidth",
          "sleeveLength",
          "shirtLength",
          "neck",
          "waist",
          "hip",
          "inseam",
          "rise",
          "thigh",
        ]
      : ["bust", "topLength", "waist", "hip", "inseam", "rise", "thigh"];

  const isMeasurementFilled = requiredMeasurements.every(
    (key) => form.measurements[key]
  );

  const isSubmitDisabled = requiredFields.includes("") || !isMeasurementFilled;

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
      
      <RequestUploadForm
        form={form}
        handleInput={handleInput}
        handleFile={handleFile}
        preview={preview}
        isSubmitDisabled={isSubmitDisabled}
        handleSubmit={handleSubmit}
      />

      <h2 className="text-xl font-bold mt-8 mb-2">My Requests</h2>
      
      {requests.map((req) => (
        <div key={req._id} className="border p-3 my-2 rounded shadow">
          {editingId === req._id ? (
            <RequestEditForm
              req={req}
              handleEditChange={handleEditChange}
              handleEditMeasurementsChange={handleEditMeasurementsChange}
              handleEditFile={handleEditFile}
              handleEditSubmit={handleEditSubmit}
              setEditingId={setEditingId}
            />
          ) : (
            <RequestDisplayCard
              req={req}
              handleDelete={handleDelete}
              setEditingId={setEditingId}
              handleConfirm={handleConfirm}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Customize;
