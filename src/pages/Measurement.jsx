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
      toast.error(
        "Maximum 5 measurements allowed. Please delete one to add new."
      );
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
      toast.error(
        `Please fill all required fields: ${missingFields.join(", ")}`
      );
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
    <div className="bg-neutral-primary min-h-screen py-8 px-4">
      {/* Page Heading */}
      <div className="max-w-4xl mx-auto text-center mb-8">
        <h1 className="text-4xl font-bold text-brown-primary">
          Measurement Management
        </h1>
        <p className="text-brown-secondary mt-2">
          Add and manage your custom measurements
        </p>
      </div>

      {/* Add Measurement Form */}
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg mb-12">
        <h2 className="text-2xl font-semibold text-brown-primary mb-4">
          Add New Measurement
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* Name */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-brown-primary">
              Name
            </label>
            <input
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 rounded-lg border border-yellow-tertiary shadow-sm focus:outline-yellow-secondary"
              required
            />
          </div>

          {/* Gender */}
          <div className="flex flex-col">
            <label className="mb-1 font-semibold text-brown-primary">
              Gender
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="p-3 rounded-lg border border-yellow-tertiary shadow-sm focus:outline-yellow-secondary"
            >
              <option>Male</option>
              <option>Female</option>
            </select>
          </div>

          {/* Measurement Fields */}
          {getFields(formData.gender).map((key) => (
            <div key={key} className="flex flex-col relative">
              <label className="mb-1 font-semibold text-brown-primary">
                {key}
              </label>
              <input
                type="number"
                name={key}
                placeholder={key}
                value={formData.measurements[key] || ""}
                onChange={handleChange}
                className="p-3 pr-12 rounded-lg border border-yellow-tertiary shadow-sm focus:outline-yellow-secondary"
              />
              <span className="absolute right-3 top-13 -translate-y-1/2 text-brown-primary font-semibold">
                cm
              </span>
            </div>
          ))}

          {/* Submit Button */}
          <div className="col-span-full flex justify-end mt-2">
            <button
              type="submit"
              className="bg-yellow-tertiary text-brown-tertiary px-6 py-2 rounded-lg font-semibold hover:bg-yellow-secondary transition-colors duration-200"
            >
              Save Measurement
            </button>
          </div>
        </form>
      </div>

      {/* Measurements List */}
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-brown-primary mb-6 text-center">
          Your Measurements
        </h2>
        {measurements.length === 0 ? (
          <p className="text-center text-brown-secondary">
            No measurements added yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">
            {measurements.map((m) => (
              <div
                key={m._id}
                className="bg-white rounded-2xl shadow-lg p-6 relative"
              >
                {editId === m._id ? (
                  <>
                    <div className="flex flex-col gap-3">
                      <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-brown-primary">
                          Name
                        </label>
                        <input
                          name="name"
                          value={editData.name}
                          onChange={(e) => handleChange(e, true)}
                          className="p-2 rounded-lg border border-yellow-tertiary shadow-sm focus:outline-yellow-secondary"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="mb-1 font-semibold text-brown-primary">
                          Gender
                        </label>
                        <select
                          name="gender"
                          value={editData.gender}
                          onChange={(e) => handleChange(e, true)}
                          className="p-2 rounded-lg border border-yellow-tertiary shadow-sm focus:outline-yellow-secondary"
                        >
                          <option>Male</option>
                          <option>Female</option>
                        </select>
                      </div>
                      {getFields(editData.gender).map((key) => (
                        <div key={key} className="flex flex-col">
                          <label className="mb-1 font-semibold text-brown-primary">
                            {key}
                          </label>
                          <input
                            type="number"
                            name={key}
                            value={editData.measurements[key] || ""}
                            onChange={(e) => handleChange(e, true)}
                            className="p-2 rounded-lg border border-yellow-tertiary shadow-sm focus:outline-yellow-secondary"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleUpdate(m._id)}
                        className="bg-yellow-tertiary text-brown-tertiary px-4 py-2 rounded-lg font-semibold hover:bg-yellow-secondary transition-colors duration-200"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => setEditId(null)}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h4 className="text-brown-primary font-semibold text-lg mb-2">
                      {m.name} ({m.gender})
                    </h4>
                    <ul className="list-none p-0">
                      {Object.entries(m.measurements).map(([key, value]) =>
                        value != null ? (
                          <li key={key} className="mt-1">
                            <strong>{key}:</strong> {value}{" "}
                            <span className="ml-1">cm</span>
                          </li>
                        ) : null
                      )}
                    </ul>
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleEdit(m)}
                        className="bg-yellow-tertiary text-brown-tertiary px-4 py-2 rounded-lg font-semibold hover:bg-yellow-secondary transition-colors duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-600 transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Measurement;
