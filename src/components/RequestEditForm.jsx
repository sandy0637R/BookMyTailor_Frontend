import React from "react";


const RequestEditForm = ({
  req,
  handleEditChange,
  handleEditMeasurementsChange,
  handleEditFile,
  handleEditSubmit,
  setEditingId
}) => (
  <>
    <select
      value={req.gender}
      onChange={(e) => handleEditChange(e, req._id, "gender")}
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
    <input
      value={req.budget}
      onChange={(e) => handleEditChange(e, req._id, "budget")}
      placeholder="Budget"
    />
    <input
      value={req.duration}
      onChange={(e) => handleEditChange(e, req._id, "duration")}
      placeholder="Duration"
    />
    <textarea
      value={req.description}
      onChange={(e) => handleEditChange(e, req._id, "description")}
    />
    <input
      type="number"
      min="1"
      value={req.quantity || ""}
      onChange={(e) => handleEditChange(e, req._id, "quantity")}
      placeholder="Quantity"
    />

    {/* Male Measurements */}
    {req.gender === "Male" && (
      <>
        <input
          value={req.measurements?.chest || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "chest")
          }
          placeholder="Chest"
        />
        <input
          value={req.measurements?.shoulderWidth || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "shoulderWidth")
          }
          placeholder="Shoulder Width"
        />
        <input
          value={req.measurements?.sleeveLength || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "sleeveLength")
          }
          placeholder="Sleeve Length"
        />
        <input
          value={req.measurements?.shirtLength || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "shirtLength")
          }
          placeholder="Shirt Length"
        />
        <input
          value={req.measurements?.neck || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "neck")
          }
          placeholder="Neck"
        />
        <input
          value={req.measurements?.waist || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "waist")
          }
          placeholder="Waist"
        />
        <input
          value={req.measurements?.hip || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "hip")
          }
          placeholder="Hip"
        />
        <input
          value={req.measurements?.inseam || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "inseam")
          }
          placeholder="Inseam"
        />
        <input
          value={req.measurements?.rise || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "rise")
          }
          placeholder="Rise"
        />
        <input
          value={req.measurements?.thigh || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "thigh")
          }
          placeholder="Thigh"
        />
      </>
    )}

    {/* Female Measurements */}
    {req.gender === "Female" && (
      <>
        <input
          value={req.measurements?.bust || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "bust")
          }
          placeholder="Bust"
        />
        <input
          value={req.measurements?.topLength || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "topLength")
          }
          placeholder="Top Length"
        />
        <input
          value={req.measurements?.waist || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "waist")
          }
          placeholder="Waist"
        />
        <input
          value={req.measurements?.hip || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "hip")
          }
          placeholder="Hip"
        />
        <input
          value={req.measurements?.inseam || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "inseam")
          }
          placeholder="Inseam"
        />
        <input
          value={req.measurements?.rise || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "rise")
          }
          placeholder="Rise"
        />
        <input
          value={req.measurements?.thigh || ""}
          onChange={(e) =>
            handleEditMeasurementsChange(e, req._id, "thigh")
          }
          placeholder="Thigh"
        />
      </>
    )}

    <input type="file" onChange={(e) => handleEditFile(e, req._id)} />
    {req.imagePreview && (
      <img
        src={req.imagePreview}
        className="w-32 h-32 object-cover"
        alt="preview"
      />
    )}
    <button
      onClick={() => handleEditSubmit(req)}
      className="text-green-600"
    >
      Save
    </button>
    <button
      onClick={() => setEditingId(null)}
      className="text-gray-600 ml-2"
    >
      Cancel
    </button>
  </>
);

export default RequestEditForm;