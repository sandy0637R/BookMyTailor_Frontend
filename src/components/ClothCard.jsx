import React from "react";

const ClothCard = ({ cloth, onEdit, onDelete }) => {
  return (
    <div className="bg-neutral-primary rounded-2xl shadow-lg p-5 hover:shadow-2xl transition-shadow duration-300">
      <img
        src={
          cloth.image?.startsWith("/uploads")
            ? `https://bookmytailor-backend.onrender.com${cloth.image}`
            : "/placeholder.jpg"
        }
        alt={cloth.name}
        className="w-full h-44 object-cover rounded-xl mb-3"
      />
      <h2 className="text-xl font-bold mb-1 text-brown-primary">{cloth.name}</h2>
      <p className="text-brown-secondary text-sm mb-1">
        Manufacturer: {cloth.tailor?.name || "Unknown"}
      </p>
      <p className="text-brown-secondary text-sm mb-1">Type: {cloth.type}</p>
      <p className="text-brown-secondary text-sm mb-1">Price: ₹{cloth.price}</p>
      <p className="text-brown-secondary text-sm mb-1">Size: {cloth.size?.join(", ")}</p>
      <p className="text-brown-secondary text-sm mb-2">Gender: {cloth.gender}</p>
      <p className="text-brown-tertiary text-sm mb-4 line-clamp-3">{cloth.description}</p>

      <div className="flex gap-3">
        <button
          onClick={() => onEdit(cloth)}
          className="bg-yellow-tertiary text-brown-tertiary px-4 py-2 rounded-lg font-semibold hover:bg-yellow-secondary transition-colors duration-200"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(cloth._id)}
          className="bg-danger-primary text-neutral-primary px-4 py-2 rounded-lg font-semibold hover:bg-danger-secondary transition-colors duration-200"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default ClothCard;
