import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";

const Measurement = () => {
  const [measurements, setMeasurements] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    gender: "Male",
    measurements: {},
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(null);

  const { token } = useSelector((state) => state.auth);

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

  const fetchMeasurements = async () => {
    try {
      const res = await axios.get("http://localhost:5000/measurements/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMeasurements(res.data || []);
    } catch (err) {
      toast.error("Failed to load measurements");
    }
  };

  const handleChange = (e, isEdit = false) => {
    const { name, value } = e.target;

    if (isEdit) {
      if (["name", "gender"].includes(name)) {
        const updated = { ...editData, [name]: value };
        if (name === "gender") {
          updated.measurements = {};
        }
        setEditData(updated);
      } else {
        setEditData({
          ...editData,
          measurements: {
            ...editData.measurements,
            [name]: value,
          },
        });
      }
    } else {
      if (["name", "gender"].includes(name)) {
        const updated = { ...formData, [name]: value };
        if (name === "gender") {
          updated.measurements = {};
        }
        setFormData(updated);
      } else {
        setFormData({
          ...formData,
          measurements: {
            ...formData.measurements,
            [name]: value,
          },
        });
      }
    }
  };

const handleSubmit = async (e) => {
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

  try {
    await axios.post("http://localhost:5000/measurements/", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Measurement added!");
    setFormData({ name: "", gender: "Male", measurements: {} });
    fetchMeasurements();
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to save");
  }
};




  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/measurements/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Deleted");
      fetchMeasurements();
    } catch {
      toast.error("Delete failed");
    }
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditData({ ...item }); // shallow copy
  };

  const handleUpdate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/measurements/${id}`, editData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Updated");
      setEditId(null);
      fetchMeasurements();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, []);

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
                <h4>
                  {m.name} ({m.gender})
                </h4>
                <ul style={{ listStyle: "none", paddingLeft: 0 }}>
                  {Object.entries(m.measurements).map(([key, value]) =>
                    value != null ? (
                      <li key={key}>
                        <strong>{key}</strong>: {value}
                      </li>
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
