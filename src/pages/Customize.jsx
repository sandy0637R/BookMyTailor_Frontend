import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import RequestDisplayCard from "../components/RequestDisplayCard";
import RequestEditForm from "../components/RequestEditForm";
import RequestUploadForm from "../components/RequestUploadForm";
import { setChatUser } from "../redux/chatSlice";

const Customize = () => {
  const token = useSelector((state) => state.auth.token);
  const role = useSelector((state) => state.auth.role);

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
  const [showHistory, setShowHistory] = useState(false);
  const [openCardId, setOpenCardId] = useState(null);

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

  const requiredFields = [form.gender, form.budget, form.duration, form.image];

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
      <div className="flex justify-center items-center">
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
      <div className="flex flex-wrap">
        {requests.map((req) => (
          <div key={req._id} className="w-fit m-5">
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
                handleDelete={() => handleDelete(req._id)}
                setEditingId={setEditingId}
                handleConfirm={handleConfirm}
                setChatUser={(user) => dispatch(setChatUser(user))}
              />
            )}
          </div>
        ))}
      </div>

      {history.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-8 mb-2 text-center text-brown-secondary">Order History</h2>
          <button
            onClick={() => setShowHistory((prev) => !prev)}
            className="mb-4 bg-brown-tertiary text-yellow-primary px-4 py-2 rounded   text-sm w-full hover:bg-brown-secondary hover-common"
          >
            {showHistory ? "Hide History" : "Show History"}
          </button>

          {showHistory && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm mb-4">
                <thead className="bg-brown-tertiary">
                  <tr>
                    <th className="p-2  rounded-tl-lg border-r-2 border-b-2 border-brown-primary  text-yellow-primary">
                      Tailor Name
                    </th>
                    <th className="p-2 border-r-2 border-b-2 border-brown-primary  text-yellow-primary">
                      Status
                    </th>
                    <th className="p-2 border-r-2 border-b-2 border-brown-primary text-yellow-primary">
                      Delivered On
                    </th>
                    <th className="p-2 rounded-tr-lg  border-b-2 border-brown-primary text-yellow-primary">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((req) => (
                    <React.Fragment key={req._id}>
                      <tr>
                        <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                          {typeof req.tailorId === "object"
                            ? req.tailorId.name
                            : tailors.find((t) => t._id === req.tailorId)
                                ?.name || "N/A"}
                        </td>
                        <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                          {req.status}
                        </td>
                        <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                          {req.deliveredAt
                            ? new Date(req.deliveredAt).toLocaleDateString()
                            : "Pending"}
                        </td>
                        <td className="p-2 bg-yellow-primary border-b-2 border-yellow-secondary text-center">
                          <button
                            onClick={() =>
                              setOpenCardId(
                                openCardId === req._id ? null : req._id
                              )
                            }
                            className="text-yellow-primary bg-brown-tertiary py-1 px-5 rounded-sm hover:bg-yellow-primary  hover:text-brown-tertiary shadow-[inset_0_0_15px_5px_rgba(100,100,100,0.3)] transition-all ease-in-out duration-200"
                          >
                            {openCardId === req._id
                              ? "Hide Request"
                              : "View Request"}
                          </button>
                        </td>
                      </tr>
                      {openCardId === req._id && (
                        <tr>
                          <td
                            colSpan="4"
                            className="p-2 border-b-2 border-yellow-secondary bg-yellow-primary"
                          >
                            <div className="p-2">
                              <RequestDisplayCard
                                req={req}
                                setChatUser={(user) =>
                                  dispatch(setChatUser(user))
                                }
                                handleDelete={() => {}}
                                setEditingId={() => {}}
                                handleConfirm={() => {}}
                              />
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Customize;
