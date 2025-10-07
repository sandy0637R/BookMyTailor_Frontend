import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import RequestDisplayCard from "../components/RequestDisplayCard";
import RequestEditForm from "../components/RequestEditForm";
import RequestUploadForm from "../components/RequestUploadForm";
import { setChatUser } from "../redux/chatSlice";
import CustomizeHistory from "../containers/CustomizeHistory";

const Customize = () => {
  const token = useSelector((state) => state.auth.token);
  const tailors = useSelector((state) => state.social.tailors || []);
  const dispatch = useDispatch();

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
  const [showRequests, setShowRequests] = useState(false);

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

      if (finalData.tailorId) {
        fd.append("tailorId", finalData.tailorId);
      }

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
        quantity: 1,
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/custom/request/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Request deleted");
      fetchRequests();
    } catch (err) {
      toast.error("Delete failed");
    }
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

    const measurementsFilled = required.every(
      (key) => req.measurements?.[key] !== undefined && req.measurements[key] !== ""
    );

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
    (key) => form.measurements[key] !== undefined && form.measurements[key] !== ""
  );

  const requiredFields = [form.gender, form.budget, form.duration, form.image];
  const isSubmitDisabled = requiredFields.some((f) => !f) || !isMeasurementFilled;

  return (
    <div className="p-4">
      <div className="flex justify-center items-center my-20">
        <RequestUploadForm
          form={form}
          handleInput={handleInput}
          handleFile={handleFile}
          preview={preview}
          isSubmitDisabled={isSubmitDisabled}
          handleSubmit={handleSubmit}
        />
      </div>

      <h2 className="text-xl font-bold mt-8 mb-2 text-center">My Requests</h2>

      <div className="flex justify-center mb-4">
        <button
          onClick={() => setShowRequests((prev) => !prev)}
          className="mb-4 bg-brown-tertiary text-yellow-primary px-4 py-2 rounded text-sm w-full hover:bg-brown-secondary hover-common"
        >
          {showRequests ? "Hide Requests" : "Show Requests"}
        </button>
      </div>

      {showRequests && (
        <div className="flex flex-wrap">
          {requests.map((req) => (
            <div key={req._id} className="w-fit m-5">
              {editingId === req._id ? (
                <div className="fixed inset-0 flex items-center justify-center  bg-black/50 z-50">
                  <div
                    className="absolute inset-0"
                    onClick={() => setEditingId(null)}
                  ></div>

                  <div
                    className="relative bg-neutral-primary p-6 rounded-lg shadow-lg max-h-[90vh] overflow-y-auto z-10"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <RequestEditForm
                      req={req}
                      handleEditChange={handleEditChange}
                      handleEditMeasurementsChange={handleEditMeasurementsChange}
                      handleEditFile={handleEditFile}
                      handleEditSubmit={handleEditSubmit}
                      setEditingId={setEditingId}
                    />
                  </div>
                </div>
              ) : (
                <RequestDisplayCard
                  req={req}
                  handleDelete={() => handleDelete(req._id)}
                  setEditingId={setEditingId}
                  handleConfirm={handleConfirm}
                  setChatUser={(user) => dispatch(setChatUser(user))}
                />
              )}
            </div>
          ))}
        </div>
      )}

      <CustomizeHistory history={history} />
    </div>
  );
};

export default Customize;
