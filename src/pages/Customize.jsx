import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import RequestDisplayCard from "../components/RequestDisplayCard";
import RequestEditForm from "../components/RequestEditForm";
import RequestUploadForm from "../components/RequestUploadForm";
import ChatBox from "../components/ChatBox";

const Customize = () => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);
  const profile = useSelector((state) => state.auth.profile);

  const [requests, setRequests] = useState([]);
  const [history, setHistory] = useState([]);
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
  const [chatUser, setChatUser] = useState(null);

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const all = res.data.customDressRequests || [];
      setRequests(all.filter((r) => r.status !== "Confirmed"));
      setHistory(all.filter((r) => r.status === "Confirmed"));
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

  const handleSubmit = async (finalData) => {
    try {
      const fd = new FormData();
      fd.append("gender", finalData.gender);
      fd.append("budget", finalData.budget);
      fd.append("duration", finalData.duration);
      fd.append("description", finalData.description);
      fd.append("quantity", finalData.quantity);
      fd.append("image", finalData.image);
      fd.append("measurements", JSON.stringify(finalData.measurements));
      fd.append("submittedAt", finalData.submittedAt);

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
    const male = [
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
    const female = [
      "bust",
      "topLength",
      "waist",
      "hip",
      "inseam",
      "rise",
      "thigh",
    ];
    const required = req.gender === "Male" ? male : female;

    const filled = [
      req.gender,
      req.budget,
      req.duration,
      req.quantity,
      req.measurements,
    ].every(Boolean);

    const measurementsFilled = required.every((key) => req.measurements?.[key]);

    if (!filled || !measurementsFilled) {
      toast.error("All required fields must be filled");
      return;
    }

    try {
      const fd = new FormData();
      fd.append("gender", req.gender);
      fd.append("budget", req.budget);
      fd.append("duration", new Date(req.duration).toISOString());
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
              handleDelete={() => {}} // delete disabled
              setEditingId={setEditingId}
              handleConfirm={handleConfirm}
              setChatUser={setChatUser}
            />
          )}
        </div>
      ))}

      {history.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-2">Order History</h2>
          {history.map((req) => (
            <div key={req._id} className="border p-3 my-2 rounded shadow">
              <RequestDisplayCard
                req={req}
                setChatUser={setChatUser}
              />
            </div>
          ))}
        </>
      )}

      {chatUser && (
        <div className="fixed bottom-0 right-0 w-full max-w-md p-4 bg-white shadow-lg z-50">
          <ChatBox currentUser={profile} selectedUser={chatUser} />
          <button
            onClick={() => setChatUser(null)}
            className="mt-2 text-sm text-red-600 hover:underline"
          >
            Close Chat
          </button>
        </div>
      )}
    </div>
  );
};

export default Customize;
