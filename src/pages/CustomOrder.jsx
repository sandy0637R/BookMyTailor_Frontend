import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import ChatBox from "../components/ChatBox";

const CustomOrder = () => {
  const token = useSelector((state) => state.auth.token);
  const roles = useSelector((state) => state.auth.roles);
  const profile = useSelector((state) => state.auth.profile);

  const [uploadedRequests, setUploadedRequests] = useState([]);
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [requestHistory, setRequestHistory] = useState([]);
  const [statusMap, setStatusMap] = useState({});
  const [chatUser, setChatUser] = useState(null);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (roles?.includes("tailor")) {
      fetchUploadedRequests();
      fetchAcceptedRequests();
      fetchRequestHistory();
    }
  }, [roles]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      acceptedRequests.forEach((req) => {
        if (req.acceptedAt && req.duration) {
          updated[req._id] = getSmartTimers(req.acceptedAt, req.duration);
        }
      });
      setTimers(updated);
    }, 60000);

    return () => clearInterval(interval);
  }, [acceptedRequests]);

  const getSmartTimers = (acceptedAt, duration) => {
    const start = new Date(acceptedAt).getTime();
    const end = new Date(duration).getTime();
    const now = Date.now();
    const total = end - start;

    const readyAt = start + total * 0.6;
    const outAt = start + total * 0.85;
    const deliveredAt = end;

    const format = (ms) => {
      if (ms <= 0) return "Now";
      const h = Math.floor(ms / (1000 * 60 * 60));
      const m = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
      return `${h}h ${m}m`;
    };

    const progress = Math.min(100, Math.floor(((now - start) / total) * 100));

    return {
      readyIn: format(readyAt - now),
      outIn: format(outAt - now),
      deliverIn: format(deliveredAt - now),
      progress,
    };
  };

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

  const fetchRequestHistory = async () => {
    try {
      const res = await axios.get("http://localhost:5000/custom/request-history", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRequestHistory(res.data);
    } catch {
      toast.error("Failed to load request history");
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

  const renderRequestCard = (req, showAccept, showUpdate) => {
    const requestId = req.requestId?.$oid || req._id;
    const customerId = req.customerId?.$oid || req.customer?.userId;

    if (showAccept && customerId === profile._id) return null;

    return (
      <div key={requestId} className="border p-4 mb-4 rounded shadow">
        <p><b>Requested by:</b> {req.customer?.name || req.customerName}</p>
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

        {timers[requestId] && (
          <div className="bg-yellow-50 p-2 rounded text-sm mt-2">
            <div className="mb-1 font-semibold text-yellow-900">⏳ Deadline Tracker</div>
            <div className="h-2 bg-gray-200 rounded overflow-hidden mb-2">
              <div
                className={`h-full ${
                  timers[requestId].progress >= 90
                    ? "bg-red-600"
                    : timers[requestId].progress >= 60
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`}
                style={{ width: `${timers[requestId].progress}%` }}
              ></div>
            </div>
            <ul className="list-disc pl-5">
              <li>🛠️ Ready in: {timers[requestId].readyIn}</li>
              <li>🚚 Out for Delivery in: {timers[requestId].outIn}</li>
              <li>✅ Delivered in: {timers[requestId].deliverIn}</li>
            </ul>
            <p className="mt-1 text-gray-600">Progress: {timers[requestId].progress}%</p>
          </div>
        )}

        {showAccept && (
          <button
            onClick={() => handleAccept(requestId, customerId)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Accept
          </button>
        )}

        {showUpdate && (
          <div className="mt-2">
            <select
              value={statusMap[requestId] || ""}
              onChange={(e) =>
                setStatusMap((prev) => ({ ...prev, [requestId]: e.target.value }))
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
                handleStatusUpdate(requestId, customerId, statusMap[requestId])
              }
              className="ml-2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              Update
            </button>
          </div>
        )}

        {showUpdate && (
          <button
            onClick={() =>
              setChatUser({
                _id: customerId,
                name: req.customer?.name || req.customerName,
              })
            }
            className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded"
          >
            Send Message
          </button>
        )}
      </div>
    );
  };

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

      <h2 className="text-xl font-bold mb-4 mt-8">Request History</h2>
      {requestHistory.length === 0 ? (
        <p>No history available.</p>
      ) : (
        requestHistory.map((req) => renderRequestCard(req, false, false))
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

export default CustomOrder;
