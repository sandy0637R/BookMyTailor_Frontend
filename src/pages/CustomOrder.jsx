import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import ChatBox from "../components/ChatBox";
import ViewProfileButton from "../components/ViewProfileButton";
import { setSelectedRequest, setShowModal } from "../redux/customSlice";
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate
import { startChatWithUserRequest,setChatUser } from "../redux/chatSlice";

const CustomOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ create navigate instance

  const token = useSelector((state) => state.auth.token);
  const roles = useSelector((state) => state.auth.roles);
  const profile = useSelector((state) => state.auth.profile);

  const {
    uploadedRequests,
    acceptedRequests,
    requestHistory,
    directRequests,
    timers,
    selectedRequest,
    showModal,
  } = useSelector((state) => state.custom);
  const chatUser = useSelector((state) => state.chat.chatUser);

  const statusPhases = ["Accepted", "Ready", "Out for Delivery", "Delivered"];

  useEffect(() => {
    if (roles?.includes("tailor")) {
      dispatch({ type: "FETCH_UPLOADED_REQUESTS" });
      dispatch({ type: "FETCH_ACCEPTED_REQUESTS" });
      dispatch({ type: "FETCH_REQUEST_HISTORY" });
      dispatch({ type: "FETCH_DIRECT_REQUESTS" });
    }
  }, [roles, dispatch]);

  const handleAccept = (requestId, customerId) => {
    dispatch({ type: "ACCEPT_REQUEST", payload: { requestId, customerId } });
  };

  const handleStatusUpdate = (requestId, customerId, newStatus) => {
    if (!window.confirm(`Mark this request as '${newStatus}'?`)) return;
    dispatch({
      type: "UPDATE_REQUEST_STATUS",
      payload: { requestId, customerId, newStatus },
    });
  };

const handleStartChat = async (receiverId) => {
  const confirmStart = window.confirm("Do you want to start a conversation with this user?");
  
  if (!confirmStart) return;

  dispatch(startChatWithUserRequest({
    senderId: profile._id,
    receiverId,
  }));

  // Slight delay to ensure Redux updates before navigation
  setTimeout(() => {
    navigate(`/chat/${receiverId}`);
  }, 300);
};



  const renderRequestCard = (req, showAccept, showUpdate) => {
    const requestId = req._id;
    const customerId = req.customer?.userId;
    const currentTimer = timers[requestId];
    const nextStatusMap = {
      Accepted: "Ready",
      Ready: "Out for Delivery",
      "Out for Delivery": "Delivered",
      Delivered: null,
    };
    const nextStatus = nextStatusMap[req.status];

    return (
      <div className="space-y-2">
        <p>
          <b>Requested by:</b> {req.customer?.name || req.customerName}{" "}
          <ViewProfileButton userId={req.customer?.userId} />
        </p>
        <p>
          <b>Status:</b> {req.status}
        </p>
        <p>
          <b>Budget:</b> ₹{req.budget}
        </p>
        <p>
          <b>Duration:</b>{" "}
          {statusPhases.includes(req.status) &&
          req.status !== "Delivered" &&
          currentTimer ? (
            <span className={`font-mono ${currentTimer.color}`}>
              {currentTimer.timeLeft}
            </span>
          ) : (
            req.duration
          )}
        </p>
        <p>
          <b>Gender:</b> {req.gender}
        </p>
        <p>
          <b>Description:</b> {req.description || "N/A"}
        </p>
        <p>
          <b>Measurements:</b> {JSON.stringify(req.measurements)}
        </p>
        {req.image && (
          <img
            src={`http://localhost:5000/uploads/customRequests/${req.image}`}
            alt="Dress"
            className="w-32 h-32 object-cover my-2"
          />
        )}
        {showUpdate && nextStatus && (
          <div className="flex gap-2 items-center">
            <button
              onClick={() =>
                handleStatusUpdate(requestId, customerId, nextStatus)
              }
              className="px-3 py-1 bg-blue-600 text-white rounded"
            >
              {nextStatus}
            </button>
            {currentTimer && (
              <span className={`text-sm font-mono ${currentTimer.color}`}>
                ⏱ {currentTimer.timeLeft}
              </span>
            )}
          </div>
        )}
        {!showAccept && (
          <button
  onClick={() => handleStartChat(req.customer?.userId)}
  className="px-3 py-1 bg-indigo-600 text-white rounded"
>
  Chat
</button>

        )}
        {showAccept && req.status === "Uploaded" && (
          <button
            onClick={() => handleAccept(requestId, customerId)}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Accept
          </button>
        )}
      </div>
    );
  };

  const renderRequestTable = (requests, showAccept, showUpdate) => (
    <div className="overflow-x-auto shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-200 text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Name
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Duration/Timer
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Budget
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Gender
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Status
            </th>
            <th className="px-4 py-2 text-left font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((req) => {
            const requestId = req._id;
            const customerId = req.customer?.userId;
            const currentTimer = timers[requestId];
            const nextStatusMap = {
              Accepted: "Ready",
              Ready: "Out for Delivery",
              "Out for Delivery": "Delivered",
              Delivered: null,
            };
            const nextStatus = nextStatusMap[req.status];

            return (
              <tr key={requestId} className="hover:bg-gray-50 transition">
                <td className="px-4 py-2">
                  {req.customer?.name || req.customerName}
                </td>
                <td className="px-4 py-2">
                  {statusPhases.includes(req.status) &&
                  req.status !== "Delivered" &&
                  currentTimer ? (
                    <span className={`font-mono ${currentTimer.color}`}>
                      {currentTimer.timeLeft}
                    </span>
                  ) : (
                    req.duration
                  )}
                </td>
                <td className="px-4 py-2">₹{req.budget}</td>
                <td className="px-4 py-2">{req.gender}</td>
                <td className="px-4 py-2">{req.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      dispatch(setSelectedRequest(req));
                      dispatch(setShowModal(true));
                    }}
                    className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                  >
                    View Request
                  </button>
                  {showAccept && req.status === "Uploaded" && (
                    <button
                      onClick={() => handleAccept(requestId, customerId)}
                      className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                      Accept
                    </button>
                  )}
                  {showUpdate && nextStatus && (
                    <button
                      onClick={() =>
                        handleStatusUpdate(requestId, customerId, nextStatus)
                      }
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      {nextStatus}
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  if (!roles?.includes("tailor")) {
    return (
      <div className="p-4 text-red-600">
        You are not authorized to view this page.
      </div>
    );
  }

  return (
    <div className="p-4 space-y-8">
      <div>
        <h2 className="text-xl font-bold mb-2">Available Public Requests</h2>
        {renderRequestTable(uploadedRequests, true, false)}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Direct Requests Sent To You</h2>
        {renderRequestTable(directRequests, true, false)}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Your Accepted Requests</h2>
        {renderRequestTable(acceptedRequests, false, true)}
      </div>
      <div>
        <h2 className="text-xl font-bold mb-2">Request History</h2>
        <div className="overflow-x-auto shadow rounded-lg">
          <table className="min-w-full divide-y divide-gray-200 bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Delivered On
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Budget
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Gender
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requestHistory.map((req) => (
                <tr key={req._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2">
                    {req.customer?.name || req.customerName}
                  </td>
                  <td className="px-4 py-2">
                    {req.deliveredAt
                      ? new Date(req.deliveredAt).toLocaleDateString()
                      : "Not Delivered"}
                  </td>
                  <td className="px-4 py-2">₹{req.budget}</td>
                  <td className="px-4 py-2">{req.gender}</td>
                  <td className="px-4 py-2">{req.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => {
                        dispatch(setSelectedRequest(req));
                        dispatch(setShowModal(true));
                      }}
                      className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                    >
                      View Request
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative">
            <button
              onClick={() => dispatch(setShowModal(false))}
              className="absolute top-2 right-2 text-red-600"
            >
              ✕
            </button>
            {renderRequestCard(
              selectedRequest,
              false,
              selectedRequest.status !== "Delivered"
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomOrder;
