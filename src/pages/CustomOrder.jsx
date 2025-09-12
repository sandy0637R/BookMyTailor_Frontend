import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "../components/ViewProfileButton";
import { setSelectedRequest, setShowModal } from "../redux/customSlice";
import { useNavigate } from "react-router-dom";
import { startChatWithUserRequest } from "../redux/chatSlice";

const CustomOrder = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const statusPhases = ["Accepted", "Ready", "Out for Delivery", "Delivered"];

  useEffect(() => {
    if (roles?.includes("tailor")) {
      dispatch({ type: "FETCH_UPLOADED_REQUESTS" });
      dispatch({ type: "FETCH_ACCEPTED_REQUESTS" });
      dispatch({ type: "FETCH_REQUEST_HISTORY" });
      dispatch({ type: "FETCH_DIRECT_REQUESTS" });
    }
  }, [roles, dispatch]);

  const handleAccept = async (requestId, customerId) => {
    const confirmAccept = await window.confirm(
      "Are you sure you want to accept this request?"
    );
    if (!confirmAccept) return;
    dispatch({ type: "ACCEPT_REQUEST", payload: { requestId, customerId } });
  };

  const handleStatusUpdate = async (requestId, customerId, newStatus) => {
    const confirmUpdate = await window.confirm(
      `Mark this request as '${newStatus}'?`
    );
    if (!confirmUpdate) return;
    dispatch({
      type: "UPDATE_REQUEST_STATUS",
      payload: { requestId, customerId, newStatus },
    });
  };

  const handleStartChat = async (receiverId) => {
    const confirmStart = await window.confirm(
      "Do you want to start a conversation with this user?"
    );
    if (!confirmStart) return;

    dispatch(
      startChatWithUserRequest({
        senderId: profile._id,
        receiverId,
      })
    );

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
        <p className="flex justify-between items-center bg-brown-secondary p-5 text-neutral-primary rounded-lg mb-4">
          <span className="text-xl font-semibold ">
            {req.customer?.name || req.customerName}{" "}
          </span>
          <ViewProfileButton userId={req.customer?.userId} />
        </p>
        <div className="flex justify-between items-center">
          <div>
            {" "}
            {req.image && (
              <img
                src={`http://localhost:5000/uploads/customRequests/${req.image}`}
                alt="Dress"
                className="w-48 h-48 object-cover my-2 border-3 border-brown-primary rounded-lg"
              />
            )}
          </div>
          <div className="space-y-2 mr-10">
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
          </div>
        </div>
        {showUpdate && nextStatus && (
          <div className="flex gap-2 items-center bg-yellow-primary justify-between p-3 rounded-lg">
            <button
              onClick={() =>
                handleStatusUpdate(requestId, customerId, nextStatus)
              }
              className="px-3 py-1 bg-blue-600 text-white rounded hover-common"
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
        <p>
          <b>Measurements:</b>
        </p>
        <ul className="list-disc list-inside flex flex-wrap bg-yellow-primary p-5 rounded-lg justify-between mb-5">
          {req.measurements
            ? Object.entries(req.measurements).map(([key, value]) => (
                <li key={key} className="w-[34%]">
                  <span className="font-semibold">{key}</span>: {value}
                </li>
              ))
            : "N/A"}
        </ul>

        {!showAccept && (
          <button
            onClick={() => handleStartChat(req.customer?.userId)}
            className="px-5 py-1 bg-brown-secondary text-neutral-primary rounded hover-common "
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
      <table className="min-w-full divide-y divide-yellow-tertiary bg-yellow-primary border border-gray-200 text-sm">
        <thead className="bg-brown-primary">
          <tr>
            <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
              Name
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
              Duration/Timer
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
              Budget
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
              Gender
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
              Status
            </th>
            <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
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
              <tr key={requestId} className="hover:bg-yellow-100">
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
                  ) : req.duration ? (
                    new Date(req.duration).toLocaleDateString("en-GB") // ✅ dd/mm/yyyy format
                  ) : (
                    ""
                  )}
                </td>

                <td className="px-4 py-2">₹{req.budget}</td>
                <td className="px-4 py-2">{req.gender}</td>
                <td className="px-4 py-2 text-green-700">{req.status}</td>
                <td className="px-4 py-2 space-x-2">
                  <button
                    onClick={() => {
                      dispatch(setSelectedRequest(req));
                      dispatch(setShowModal(true));
                    }}
                    className="px-3 py-1 bg-brown-primary text-neutral-primary rounded hover-common"
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
    <div className="p-4 space-y-8 bg-neutral-primary">
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
          <table className="min-w-full divide-y divide-brown-primary bg-yellow-primary border border-gray-200 text-sm">
            <thead className="bg-brown-primary">
              <tr>
                <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
                  Name
                </th>
                <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
                  Delivered On
                </th>
                <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
                  Budget
                </th>
                <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
                  Gender
                </th>
                <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
                  Status
                </th>
                <th className="px-4 py-2 text-left font-semibold text-neutral-primary">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requestHistory.map((req) => (
                <tr key={req._id} className="hover:bg-yellow-100 transition">
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
                  <td className="px-4 py-2 text-green-700">{req.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => {
                        dispatch(setSelectedRequest(req));
                        dispatch(setShowModal(true));
                      }}
                      className="px-3 py-1 bg-brown-primary text-neutral-primary rounded hover-common"
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
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => dispatch(setShowModal(false))}
        >
          <div
            className="bg-white p-4 rounded shadow-lg max-w-lg w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => dispatch(setShowModal(false))}
              className="absolute bottom-4 right-4 bg-danger-primary px-4 py-1 rounded-sm text-neutral-primary"
            >
              Close
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
