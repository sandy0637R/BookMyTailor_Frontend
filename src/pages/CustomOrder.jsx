import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const CustomOrder = () => {
  const token = useSelector((state) => state.auth.token);
  const roles = useSelector((state) => state.auth.roles);
  const profile = useSelector((state) => state.auth.profile);

  const [uploadedRequests, setUploadedRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    if (roles?.includes("tailor")) {
      fetchUploadedRequests();
      fetchAcceptedRequests();
    }
  }, [roles]);

  const fetchUploadedRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/custom/requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUploadedRequests(res.data);
    } catch {
      toast.error("Failed to load uploaded requests");
    }
  };

  const fetchAcceptedRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/custom/accepted-requests", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setAcceptedRequests(res.data);
    } catch {
      toast.error("Failed to load accepted requests");
    }
  };

  const handleAccept = async (requestId, customerId) => {
    try {
      await axios.put(
        `http://localhost:5000/custom/request/${customerId}/${requestId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Request accepted");
      fetchUploadedRequests();
      fetchAcceptedRequests();
    } catch {
      toast.error("Failed to accept request");
    }
  };

  const handleStatusUpdate = async (requestId, customerId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:5000/custom/request/${customerId}/${requestId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Status updated");
      fetchAcceptedRequests();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const statusOptions = ["Accepted", "Ready", "Out for Delivery", "Delivered"];

  if (!roles?.includes("tailor")) {
    return (
      <div className="p-4 text-red-600">
        You are not authorized to view this page.
      </div>
    );
  }

  const renderRequestCard = (req, showAccept, showUpdate) => (
    <div key={req._id} className="border p-4 mb-4 rounded shadow">
      <p><b>Requested by:</b> {req.customer?.name}</p>
      <p><b>Status:</b> {req.status}</p>
      <p><b>Budget:</b> ₹{req.budget}</p>
      <p><b>Duration:</b> {req.duration}</p>
      <p><b>Gender:</b> {req.gender}</p>
      <p><b>Description:</b> {req.description || "N/A"}</p>
      <p><b>Measurements:</b> {JSON.stringify(req.measurements)}</p>
      {req.image && (
        <img
          src={`http://localhost:5000/uploads/customRequests/${req.image}`}
          alt="Dress"
          className="w-32 h-32 object-cover my-2"
        />
      )}

      {showAccept && (
        <button
          onClick={() => handleAccept(req._id, req.customer?.userId)}
          className="bg-green-600 text-white px-3 py-1 rounded"
        >
          Accept
        </button>
      )}

      {showUpdate && (
        <div className="mt-2">
          <select
            value={statusMap[req._id] || ""}
            onChange={(e) =>
              setStatusMap((prev) => ({ ...prev, [req._id]: e.target.value }))
            }
            className="border rounded px-2 py-1"
          >
            <option value="">Update Status</option>
            {statusOptions
              .filter((s) => statusOptions.indexOf(s) > statusOptions.indexOf(req.status))
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
          <button
            onClick={() =>
              handleStatusUpdate(req._id, req.customer?.userId, statusMap[req._id])
            }
            className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
          >
            Update
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Custom Requests</h2>
      {uploadedRequests.length === 0 ? (
        <p>No new requests available.</p>
      ) : (
        uploadedRequests.map((req) => renderRequestCard(req, true, false))
      )}

      <h2 className="text-xl font-bold mb-4 mt-8">Your Accepted Requests</h2>
      {acceptedRequests.length === 0 ? (
        <p>No accepted requests.</p>
      ) : (
        acceptedRequests.map((req) => renderRequestCard(req, false, true))
      )}
    </div>
  );
};

export default CustomOrder;
