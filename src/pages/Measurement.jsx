import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMeasurementsRequest,
  addMeasurementRequest,
  deleteMeasurementRequest,
  updateMeasurementRequest,
} from "../redux/measurementSlice";
import { toast } from "react-hot-toast";

const Measurement = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { measurements } = useSelector((state) => state.measurement);

  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    measurements: {},
  });

  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);

  const maleFields = [
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
  ];

  const femaleFields = [
    "bust",
    "topLength",
    "waist",
    "hip",
    "inseam",
    "rise",
    "thigh",
  ];

  const getFields = (gender) => (gender === "Male" ? maleFields : femaleFields);

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;

    if (isEdit) {
      const updated = { ...editData };
      if (["name", "gender"].includes(name)) {
        updated[name] = value;
        if (name === "gender") updated.measurements = {};
      } else {
        updated.measurements = {
          ...updated.measurements,
          [name]: value,
        };
      }
      setEditData(updated);
    } else {
      const updated = { ...formData };
      if (["name", "gender"].includes(name)) {
        updated[name] = value;
        if (name === "gender") updated.measurements = {};
      } else {
        updated.measurements = {
          ...updated.measurements,
          [name]: value,
        };
      }
      setFormData(updated);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (measurements.length >= 5) {
      toast.error("Maximum 5 measurements allowed. Please delete one to add new.");
      return;
    }

    const isDuplicateName = measurements.some(
      (m) => m.name.trim().toLowerCase() === formData.name.trim().toLowerCase()
    );
    if (isDuplicateName) {
      toast.error("You already have a measurement with this name.");
      return;
    }

    const requiredFields = getFields(formData.gender);
    const missingFields = requiredFields.filter(
      (field) => !formData.measurements[field]
    );
    if (missingFields.length > 0) {
      toast.error(`Please fill all required fields: ${missingFields.join(", ")}`);
      return;
    }

    dispatch(addMeasurementRequest({ formData, token }));
    setFormData({ name: "", gender: "Male", measurements: {} });
  };

  const handleDelete = (id) => {
    dispatch(deleteMeasurementRequest({ id, token }));
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditData({ ...item });
  };

  const handleUpdate = (id) => {
    dispatch(updateMeasurementRequest({ id, formData: editData, token }));
    setEditId(null);
  };

  useEffect(() => {
    if (token) dispatch(fetchMeasurementsRequest(token));
  }, [dispatch, token]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>Add Measurement</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: "30px" }}>
        <input
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option>Male</option>
          <option>Female</option>
        </select>

        {getFields(formData.gender).map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            placeholder={key}
            value={formData.measurements[key] || ""}
            onChange={handleChange}
          />
        ))}

        <button type="submit">Save</button>
      </form>

      <h3>Your Measurements</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {measurements.map((m) => (
          <div
            key={m._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: "10px",
              padding: "15px",
              width: "300px",
              background: "#f9f9f9",
            }}
          >
            {editId === m._id ? (
              <>
                <input
                  name="name"
                  value={editData.name}
                  onChange={(e) => handleChange(e, true)}
                />
                <select
                  name="gender"
                  value={editData.gender}
                  onChange={(e) => handleChange(e, true)}
                >
                  <option>Male</option>
                  <option>Female</option>
                </select>
                {getFields(editData.gender).map((key) => (
                  <input
                    key={key}
                    type="number"
                    name={key}
                    placeholder={key}
                    value={editData.measurements[key] || ""}
                    onChange={(e) => handleChange(e, true)}
                  />
                ))}
                <button onClick={() => handleUpdate(m._id)}>Update</button>
                <button onClick={() => setEditId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <h4>{m.name} ({m.gender})</h4>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {Object.entries(m.measurements).map(([key, value]) =>
                    value != null ? (
                      <li key={key}><strong>{key}</strong>: {value}</li>
                    ) : null
                  )}
                </ul>
                <button onClick={() => handleEdit(m)}>Edit</button>
                <button onClick={() => handleDelete(m._id)}>Delete</button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Measurement;
