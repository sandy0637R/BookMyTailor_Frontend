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
  const [directRequests, setDirectRequests] = useState([]); // ✅ added
  const [chatUser, setChatUser] = useState(null);
  const [timers, setTimers] = useState({});

  useEffect(() => {
    if (roles?.includes("tailor")) {
      fetchUploadedRequests();
      fetchAcceptedRequests();
      fetchRequestHistory();
      fetchDirectRequests(); // ✅ added
    }
  }, [roles]);

  useEffect(() => {
    const interval = setInterval(() => {
      const updated = {};
      acceptedRequests.forEach((req) => {
        if (req.acceptedAt && req.duration) {
          const timer = getSmartTimer(req.acceptedAt, req.duration, req.status);
          if (timer) updated[req._id] = timer;
        }
      });
      setTimers(updated);
    }, 1000);

    return () => clearInterval(interval);
  }, [acceptedRequests]);

  const getSmartTimer = (acceptedAt, duration, status) => {
    const now = Date.now();
    const start = new Date(acceptedAt).getTime();
    const end = new Date(duration).getTime();
    const total = end - start;

    const statusPhases = ["Accepted", "Ready", "Out for Delivery", "Delivered"];
    const ratios = [0.5, 0.25, 0.2, 0.05];
    const currentIdx = statusPhases.indexOf(status);
    if (currentIdx === -1) return null;

    let nextPhaseTime = start;
    for (let i = 0; i <= currentIdx; i++) {
      nextPhaseTime += total * ratios[i];
    }

    const timeLeft = nextPhaseTime - now;

    const format = (ms) => {
      const abs = Math.abs(ms);
      const h = String(Math.floor(abs / 3600000)).padStart(2, "0");
      const m = String(Math.floor((abs % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((abs % 60000) / 1000)).padStart(2, "0");
      return (ms < 0 ? "-" : "") + `${h}:${m}:${s}`;
    };

    const phaseStart = nextPhaseTime - total * ratios[currentIdx];
    const phaseTotal = nextPhaseTime - phaseStart;
    const phaseElapsed = now - phaseStart;

    const progress = Math.min(100, Math.floor((phaseElapsed / phaseTotal) * 100));

    let color = "bg-green-500";
    if (timeLeft < 0) color = "bg-red-900";
    else if (timeLeft <= phaseTotal * 0.1) color = "bg-red-600";
    else if (timeLeft <= phaseTotal * 0.5) color = "bg-yellow-500";

    return {
      timeLeft: format(timeLeft),
      progress,
      color,
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

  const fetchDirectRequests = async () => {
    try {
      const res = await axios.get("http://localhost:5000/custom/requests/direct", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDirectRequests(res.data);
    } catch {
      toast.error("Failed to load direct requests");
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
      fetchDirectRequests(); // ✅ update
      fetchAcceptedRequests();
    } catch {
      toast.error("Failed to accept request");
    }
  };

  const handleStatusUpdate = async (requestId, customerId, newStatus) => {
    const confirmUpdate = window.confirm(
      `Are you sure you want to mark this request as "${newStatus}"?`
    );
    if (!confirmUpdate) return;

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
    return <div className="p-4 text-red-600">You are not authorized to view this page.</div>;
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

        {showAccept && (
          <button
            onClick={() => handleAccept(requestId, customerId)}
            className="bg-green-600 text-white px-3 py-1 rounded"
          >
            Accept
          </button>
        )}

        {showUpdate && (
          <>
            {(() => {
              const nextStatusMap = {
                Accepted: "Ready",
                Ready: "Out for Delivery",
                "Out for Delivery": "Delivered",
                Delivered: null,
              };
              const nextStatus = nextStatusMap[req.status];
              const currentTimer = timers[requestId];

              return nextStatus ? (
                <div className="mt-2 flex items-center gap-3">
                  <button
                    onClick={() => handleStatusUpdate(requestId, customerId, nextStatus)}
                    className="bg-blue-600 text-white px-3 py-1 rounded"
                  >
                    {nextStatus}
                  </button>
                  {currentTimer && (
                    <span
                      className={`text-sm font-mono ${
                        currentTimer.color === "bg-red-900"
                          ? "text-red-900"
                          : currentTimer.color === "bg-red-600"
                          ? "text-red-600"
                          : currentTimer.color === "bg-yellow-500"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      ⏱ {currentTimer.timeLeft}
                    </span>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-green-600 font-semibold">Delivered</div>
              );
            })()}
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
          </>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Available Public Requests</h2>
      {uploadedRequests.length === 0 ? (
        <p>No new requests available.</p>
      ) : (
        uploadedRequests.map((req) => renderRequestCard(req, true, false))
      )}

      <h2 className="text-xl font-bold mb-4 mt-8">Direct Requests Sent To You</h2>
      {directRequests.length === 0 ? (
        <p>No direct requests available.</p>
      ) : (
        directRequests.map((req) => renderRequestCard(req, true, false))
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
