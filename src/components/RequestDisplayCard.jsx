import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewProfileButton from "./ViewProfileButton";
import { setChatUser, startChatWithUserRequest } from "../redux/chatSlice";
import { useNavigate } from "react-router-dom";

const RequestDisplayCard = ({
  req,
  handleDelete,
  setEditingId,
  handleConfirm,
}) => {
  const dispatch = useDispatch();
  const tailors = useSelector((state) => state.social.tailors || []);
  const profile = useSelector((state) => state.auth.profile);
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

    const receiverId = req.tailorId;
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
      <div className="flex flex-col text-xs text-brown-tertiary mt-2 justify-center items-center">
        <b className="mb-1">Tracking:</b>
        <ul className="pl-4 list-disc space-y-0.5">
          {steps.map((step, index) => (
            <li
              key={index}
              className={
                index <= currentIndex
                  ? "text-yellow-tertiary font-semibold"
                  : "text-brown-secondary"
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
    <div className="bg-neutral-primary p-4 md:p-5 rounded-xl shadow-common space-y-3 max-w-md mx-auto">
      <div className="flex justify-center items-center">
        {/* Image */}
        {req?.image && (
          <img
            src={
              typeof req.image === "string"
                ? `http://localhost:5000/uploads/customRequests/${req.image}`
                : URL.createObjectURL(req.image)
            }
            alt="Dress"
            className="w-32 h-32 md:w-40 md:h-40 object-cover rounded-lg border-3 border-brown-primary mr-30 "
          />
        )}

        {/* Tracking */}
        {renderTrackingStatus(req?.status)}
      </div>

      {/* Basic Info in compact layout */}
      <div className="flex flex-wrap justify-between text-sm text-brown-tertiary gap-1 md:gap-3">
        <span>
          <b>{req?.status === "Uploaded" ? "Requested for:" : "Accepted by:"}</b>{" "}
          {tailorName()}
        </span>
        <span>
          <b>Status:</b> {req?.status}
        </span>
        <span>
          <b>Budget:</b> <span className="text-yellow-tertiary">₹{req?.budget}</span>
        </span>
        {req?.status !== "Confirmed" && (
          <>
            <span>
              <b>Duration:</b> {req?.duration}
            </span>
            <span>
              <b>Est. Delivery:</b> {getEstimatedDateTime()}
            </span>
          </>
        )}
        {req?.status === "Confirmed" && req?.deliveredAt && (
          <span>
            <b>Delivered At:</b>{" "}
            {new Date(req.deliveredAt).toLocaleString("en-IN", {
              weekday: "short",
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        )}
        <span>
          <b>Gender:</b> {req?.gender}
        </span>
      </div>

      {/* Measurements in 2-column grid */}
      <div className="text-brown-tertiary text-sm">
        <b>Measurements:</b>
        <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 mt-1 text-xs md:text-sm bg-yellow-primary p-5 rounded-lg">
          {req?.gender === "Male" &&
            [
              `Chest: ${req?.measurements?.chest} cm`,
              `Shoulder Width: ${req?.measurements?.shoulderWidth} cm`,
              `Sleeve Length: ${req?.measurements?.sleeveLength} cm`,
              `Shirt Length: ${req?.measurements?.shirtLength} cm`,
              `Neck: ${req?.measurements?.neck} cm`,
              `Waist: ${req?.measurements?.waist} cm`,
              `Hip: ${req?.measurements?.hip} cm`,
              `Inseam: ${req?.measurements?.inseam} cm`,
              `Rise: ${req?.measurements?.rise} cm`,
              `Thigh: ${req?.measurements?.thigh} cm`,
            ].map((m, i) => <div key={i}>• {m}</div>)}
          {req?.gender === "Female" &&
            [
              `Bust: ${req?.measurements?.bust} cm`,
              `Top Length: ${req?.measurements?.topLength} cm`,
              `Waist: ${req?.measurements?.waist} cm`,
              `Hip: ${req?.measurements?.hip} cm`,
              `Inseam: ${req?.measurements?.inseam} cm`,
              `Rise: ${req?.measurements?.rise} cm`,
              `Thigh: ${req?.measurements?.thigh} cm`,
            ].map((m, i) => <div key={i}>• {m}</div>)}
        </div>
      </div>

      {/* Tailor Info */}
      {tailorId && (
        <div className="flex items-center gap-3">
          <img
            src={
              tailor?.profileImage
                ? `http://localhost:5000/${tailor.profileImage}`
                : "/default-profile.png"
            }
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-brown-secondary"
          />
          <div className="flex flex-col">
            <span className="text-brown-primary font-semibold text-sm md:text-base">
              {tailorName()}
            </span>
            <ViewProfileButton userId={tailorId} buttonClass="text-xs md:text-sm" />
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-wrap justify-end gap-2 mt-2">
        {["Uploaded"].includes(req?.status) && (
          <>
            <button
              onClick={() => handleDelete(req?._id)}
              className="px-2 py-1 rounded border border-danger-primary text-danger-primary hover:bg-danger-primary hover:text-neutral-primary transition text-xs md:text-sm"
            >
              Delete
            </button>
            {req?.status === "Uploaded" && (
              <button
                onClick={() => setEditingId(req?._id)}
                className="px-2 py-1 rounded border border-yellow-tertiary text-yellow-tertiary hover:bg-yellow-tertiary hover:text-neutral-primary transition text-xs md:text-sm"
              >
                Edit
              </button>
            )}
          </>
        )}

        {(() => {
          console.log("Request status:", req?.status); // 👈 log status every render

          if (req?.status && req.status.toLowerCase().includes("deliver")) {
            console.log("Matched status for confirm button:", req.status); // 👈 log when matched
            return (
              <button
                onClick={() => handleConfirm(req?._id)}
                className="px-2 py-1 rounded border border-brown-tertiary text-brown-tertiary bg-yellow-primary w-[40%] hover:bg-neutral-primary hover-common hover:text-brown-tertiary transition text-xs md:text-sm"
              >
                Confirm
              </button>
            );
          }
          return null;
        })()}

        {req?.tailorId && req?.status !== "Uploaded" && (
          <button
            onClick={handleSendMessage}
            className="px-2 py-1 rounded bg-brown-primary text-neutral-primary hover:bg-brown-secondary transition text-xs md:text-sm"
          >
            Message
          </button>
        )}
      </div>
    </div>
  );
};

export default RequestDisplayCard;
