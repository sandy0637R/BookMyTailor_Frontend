import React from "react";

const RequestEditForm = ({
  req,
  handleEditChange,
  handleEditMeasurementsChange,
  handleEditFile,
  handleEditSubmit,
  setEditingId,
}) => (
  <div className="grid grid-cols-1 gap-4 bg-neutral-primary p-6 rounded-lg w-[100%] shadow-common hover-common mb-10">
    <h2 className="text-2xl font-bold text-center text-brown-primary mb-6">
      Edit Request
    </h2>
  {/* Image Upload */}
  <div className="flex flex-col">
    <label className="text-brown-primary font-medium mb-2">Image</label>
    
    {/* Show current image if exists */}
    {req.currentImage && !req.imagePreview && (
      <div className="mb-2">
        <img
          src={req.currentImage}
          className="w-32 h-32 object-cover border-2 border-brown-primary rounded"
          alt="current"
        />
        <p className="text-sm text-gray-500 mt-1">Current Image</p>
      </div>
    )}
  
    {/* Show preview if user selects a new image */}
    {req.imagePreview && (
      <div className="mb-2">
        <img
          src={req.imagePreview}
          className="w-32 h-32 object-cover border-2 border-brown-primary rounded"
          alt="preview"
        />
        <p className="text-sm text-gray-500 mt-1">New Image Preview</p>
      </div>
    )}
  
    <input
      type="file"
      onChange={(e) => handleEditFile(e, req._id)}
      className="border border-brown-primary px-3 py-2 rounded bg-neutral-primary text-brown-primary focus:outline-none hover:bg-yellow-primary transition"
    />
  </div>

    {/* Gender */}
    <div className="flex flex-col">
      <label className="text-brown-primary font-medium mb-1">Gender</label>
      <select
        value={req.gender}
        onChange={(e) => handleEditChange(e, req._id, "gender")}
        className="border border-brown-secondary px-3 py-2 rounded bg-brown-primary text-neutral-primary focus:outline-none hover:bg-brown-secondary transition"
      >
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>
    </div>

    {/* Budget */}
    <div className="flex flex-col">
      <label className="text-brown-primary font-medium mb-1">Budget</label>
      <div className="flex items-center border border-brown-primary rounded px-2 bg-neutral-primary">
        <span className="text-brown-primary mr-2">Rs</span>
        <input
          type="number"
          value={req.budget}
          onChange={(e) => handleEditChange(e, req._id, "budget")}
          placeholder="Budget"
          className="w-full py-2 outline-none bg-neutral-primary text-brown-primary"
        />
      </div>
    </div>

    {/* Duration */}
    <div className="flex flex-col">
      <label className="text-brown-primary font-medium mb-1">Duration</label>
      <input
        type="date"
        value={req.duration ? req.duration.split("T")[0] : ""}
        onChange={(e) => handleEditChange(e, req._id, "duration")}
        className="border border-brown-secondary px-3 py-2 rounded bg-yellow-primary text-brown-tertiary focus:outline-none hover:bg-yellow-primary transition"
      />
    </div>

    {/* Description */}
    <div className="flex flex-col">
      <label className="text-brown-primary font-medium mb-1">Description</label>
      <textarea
        value={req.description}
        onChange={(e) => handleEditChange(e, req._id, "description")}
        placeholder="Description"
        className="border border-brown-primary px-3 py-2 rounded bg-neutral-primary text-brown-primary focus:outline-none hover:bg-yellow-primary transition"
      />
    </div>

    {/* Quantity */}
    <div className="flex flex-col">
      <label className="text-brown-primary font-medium mb-1">Quantity</label>
      <input
        type="number"
        min="1"
        value={req.quantity || ""}
        onChange={(e) => handleEditChange(e, req._id, "quantity")}
        placeholder="Quantity"
        className="border border-brown-primary px-3 py-2 rounded bg-neutral-primary text-brown-primary focus:outline-none hover:bg-yellow-primary transition"
      />
    </div>

    {/* Male Measurements */}
    {req.gender === "Male" && (
      <div className="grid grid-cols-2 gap-4">
        {[
          "chest",
          "shoulderWidth",
          "sleeveLength",
          "shirtLength",
          "neck",
          "waist",
          "hip",
          "inseam",
          "rise",
          "thigh",
        ].map((m) => (
          <div key={m} className="flex flex-col">
            <label className="text-brown-primary font-medium mb-1">
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </label>
            <input
              value={req.measurements?.[m] || ""}
              onChange={(e) =>
                handleEditMeasurementsChange(e, req._id, m)
              }
              placeholder={m.charAt(0).toUpperCase() + m.slice(1)}
              className="border border-brown-primary px-3 py-2 rounded bg-neutral-primary text-brown-primary focus:outline-none hover:bg-yellow-primary transition"
            />
          </div>
        ))}
      </div>
    )}

    {/* Female Measurements */}
    {req.gender === "Female" && (
      <div className="grid grid-cols-2 gap-4">
        {["bust", "topLength", "waist", "hip", "inseam", "rise", "thigh"].map(
          (m) => (
            <div key={m} className="flex flex-col">
              <label className="text-brown-primary font-medium mb-1">
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </label>
              <input
                value={req.measurements?.[m] || ""}
                onChange={(e) => handleEditMeasurementsChange(e, req._id, m)}
                placeholder={m.charAt(0).toUpperCase() + m.slice(1)}
                className="border border-brown-primary px-3 py-2 rounded bg-neutral-primary text-brown-primary focus:outline-none hover:bg-yellow-primary transition"
              />
            </div>
          )
        )}
      </div>
    )}


    {/* Buttons */}
    <div className="flex gap-3 justify-end mt-4">
      <button
        onClick={() => handleEditSubmit(req)}
        className="bg-brown-primary text-neutral-primary px-5 py-2 rounded hover:bg-brown-secondary transition"
      >
        Save
      </button>
      <button
        onClick={() => setEditingId(null)}
        className="bg-gray-300 text-gray-600 px-5 py-2 rounded hover:bg-gray-400 transition"
      >
        Cancel
      </button>
    </div>
  </div>
);

export default RequestEditForm;
