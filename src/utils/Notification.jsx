import React from "react";

const Notification = ({ message, onClose }) => {
  return (
    <div className="fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow">
      {message}
      <button className="ml-2 text-sm" onClick={onClose}>✖</button>
    </div>
  );
};

export default Notification;
