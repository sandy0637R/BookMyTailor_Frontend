import React from "react";

const ClothCard = ({ cloth, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded shadow-md p-4">
      <img
        src={
          cloth.image?.startsWith("/uploads")
            ? `http://localhost:5000${cloth.image}`
            : "/placeholder.jpg"
        }
        alt={cloth.name}
        className="w-full h-40 object-cover rounded"
      />
      <h2 className="text-lg font-bold mt-2">{cloth.name}</h2>
      <p>Manufacturer: {cloth.tailor?.name || "Unknown"}</p> {/* 👈 NEW LINE */}
      <p>Type: {cloth.type}</p>
      <p>Price: ₹{cloth.price}</p>
      <p>Size: {cloth.size?.join(", ")}</p>
      <p>Gender: {cloth.gender}</p>
      <p className="text-sm text-gray-600">{cloth.description}</p>
      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onEdit(cloth)}
          className="bg-yellow-500 text-white px-3 py-1 rounded"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(cloth._id)}
          className="bg-red-500 text-white px-3 py-1 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClothCard;
