import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "./ViewProfileButton";
import { setChatUser } from "../redux/chatSlice";
import { useNavigate } from "react-router-dom"; 
import { startChatWithUserRequest } from "../redux/chatSlice"; 

const RequestDisplayCard = ({
  req,
  handleDelete,
  setEditingId,
  handleConfirm,
}) => {
  const dispatch = useDispatch();
  const tailors = useSelector((state) => state.social.tailors || []);
  const profile = useSelector((state) => state.auth.profile); // ✅ Add this
 
  const navigate = useNavigate();

  const tailorId =
    typeof req?.tailorId === "object" ? req?.tailorId?._id : req?.tailorId;
  const tailor =
    typeof req.tailorId === "object"
      ? req.tailorId
      : tailors.find((t) => t._id === req.tailorId);

  useEffect(() => {
    if (tailorId && !tailors.find((t) => t._id === tailorId)) {
      dispatch({ type: "FETCH_TAILOR", payload: { tailorId } });
    }
  }, [tailorId, tailors, dispatch]);

  const tailorName = () => {
    if (typeof req?.tailorId === "object") return req?.tailorId?.name;
    const found = tailors.find((t) => t._id === req?.tailorId);
    return found?.name || "Tailor";
  };

 const handleSendMessage = () => {
  const confirmStart = window.confirm(
    "Do you want to start a conversation with this tailor?"
  );
  if (!confirmStart) return;


  // ✅ Use tailorId (extracted from req.tailorId)
  const receiverId =  req.tailorId;

  if (!profile?._id || !receiverId) {
    alert("Missing profile or user ID");
    return;
  }

  dispatch(
    startChatWithUserRequest({
      senderId: profile._id,
      receiverId,
    })
  );

  dispatch(
    setChatUser({
      _id: receiverId,
      name: tailorName(),
    })
  );

  setTimeout(() => {
    navigate(`/chat/${receiverId}`);
  }, 300);
};







  const renderTrackingStatus = (status) => {
    const steps = [
      "Uploaded",
      "Accepted",
      "Ready",
      "Out for Delivery",
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
                index <= currentIndex
                  ? "text-green-600 font-semibold"
                  : "text-gray-400"
              }
            >
              {step}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const getEstimatedDateTime = () => {
    const base = req?.acceptedAt
      ? new Date(req.acceptedAt)
      : new Date(req.submittedAt);
    const end = new Date(req?.duration);
    if (!base || !end || isNaN(base.getTime()) || isNaN(end.getTime()))
      return "N/A";

    const options = {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    return end.toLocaleString("en-IN", options);
  };

  return (
    <>
      {tailorId && (
        <div className="flex items-center gap-3 mt-2">
          <img
            src={
              tailor?.profileImage
                ? `http://localhost:5000/${tailor.profileImage}`
                : "/default-profile.png"
            }
            alt="avatar"
            className="w-8 h-8 rounded-full object-cover"
          />

          <span className="text-sm font-semibold">{tailorName()}</span>
          <ViewProfileButton userId={tailorId} buttonClass="text-sm" />
        </div>
      )}

      {/* ✅ Show logic based on request type */}
      {req?.status === "Uploaded" && tailorId && (
        <p className="text-sm">
          <b>Requested for:</b> {tailorName()}
        </p>
      )}
      {req?.status !== "Uploaded" && tailorId && (
        <p className="text-sm">
          <b>Accepted by:</b> {tailorName()}
        </p>
      )}

      <p>
        <b>Status:</b> {req?.status}
      </p>
      <p>
        <b>Budget:</b> ₹{req?.budget}
      </p>
      <p>
        <b>Duration:</b> {req?.duration}
      </p>
      <p>
        <b>Estimated Delivery:</b> {getEstimatedDateTime()}
      </p>
      <p>
        <b>Gender:</b> {req?.gender}
      </p>

      <div className="mt-2 text-sm text-gray-700">
        <b>Measurements:</b>
        <ul className="list-disc pl-5 mt-1">
          {req?.gender === "Male" && (
            <>
              <li>Chest: {req?.measurements?.chest}</li>
              <li>Shoulder Width: {req?.measurements?.shoulderWidth}</li>
              <li>Sleeve Length: {req?.measurements?.sleeveLength}</li>
              <li>Shirt Length: {req?.measurements?.shirtLength}</li>
              <li>Neck: {req?.measurements?.neck}</li>
              <li>Waist: {req?.measurements?.waist}</li>
              <li>Hip: {req?.measurements?.hip}</li>
              <li>Inseam: {req?.measurements?.inseam}</li>
              <li>Rise: {req?.measurements?.rise}</li>
              <li>Thigh: {req?.measurements?.thigh}</li>
            </>
          )}
          {req?.gender === "Female" && (
            <>
              <li>Bust: {req?.measurements?.bust}</li>
              <li>Top Length: {req?.measurements?.topLength}</li>
              <li>Waist: {req?.measurements?.waist}</li>
              <li>Hip: {req?.measurements?.hip}</li>
              <li>Inseam: {req?.measurements?.inseam}</li>
              <li>Rise: {req?.measurements?.rise}</li>
              <li>Thigh: {req?.measurements?.thigh}</li>
            </>
          )}
        </ul>
      </div>

      {req?.image && (
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

      {renderTrackingStatus(req?.status)}

      {(req?.status === "Shipped" || req?.status === "Delivered") && (
        <div className="text-sm mt-1">
          <b>Tracking ID:</b> {req?.trackingId || "N/A"} <br />
          <b>Courier:</b> {req?.courier || "N/A"}
        </div>
      )}

      {["Uploaded"].includes(req?.status) && (
        <>
          <button
            onClick={() => handleDelete(req?._id)}
            className="text-red-600"
          >
            Delete
          </button>
          {req?.status === "Uploaded" && (
            <button
              onClick={() => setEditingId(req?._id)}
              className="text-blue-600 ml-4"
            >
              Edit
            </button>
          )}
        </>
      )}

      {req?.status === "Delivered" && (
        <button
          onClick={() => handleConfirm(req?._id)}
          className="text-green-600"
        >
          Confirm Delivery
        </button>
      )}

       {req?.tailorId && req?.status !== "Uploaded" && (
        <button
          onClick={handleSendMessage} // ✅ Call combined handler
          className="mt-2 bg-indigo-600 text-white px-3 py-1 rounded"
        >
          Send Message
        </button>
      )}
    </>
  );
};

export default RequestDisplayCard;
