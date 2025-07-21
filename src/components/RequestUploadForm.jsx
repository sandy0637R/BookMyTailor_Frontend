import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMeasurementsRequest } from "../redux/measurementSlice";

const RequestUploadForm = ({
  form,
  handleInput,
  handleFile,
  preview,
  isSubmitDisabled,
  handleSubmit,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tailors = useSelector((state) => state.social.tailors);
  const profile = useSelector((state) => state.auth.profile);
  const token = useSelector((state) => state.auth.token);
  const { measurements } = useSelector((state) => state.measurement);

  const [selectedTailorId, setSelectedTailorId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMeasurementName, setSelectedMeasurementName] = useState("");

  useEffect(() => {
    dispatch({ type: "FETCH_TAILORS" });
    if (token) dispatch(fetchMeasurementsRequest(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (selectedMeasurementName) {
      const m = measurements.find((m) => m.name === selectedMeasurementName);
      if (m) {
        const syntheticEvent = (name, value) => ({
          target: { name, value },
        });

        handleInput(syntheticEvent("gender", m.gender));
        Object.entries(m.measurements || {}).forEach(([key, value]) => {
          handleInput(syntheticEvent(`measurements.${key}`, value));
        });
      }
    }
  }, [selectedMeasurementName]);

  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    return date.toISOString().split("T")[0];
  };

  const submitForm = () => {
    const selectedDate = new Date(form.duration);
    const now = new Date();
    const diffHours = (selectedDate - now) / (1000 * 60 * 60);

    if (diffHours < 72) {
      alert("Duration must be at least 3 days (72 hours) from now.");
      return;
    }

    const today = new Date().toISOString();
    const finalData = {
      ...form,
      submittedAt: today,
      ...(selectedTailorId && { tailorId: selectedTailorId }),
    };
    handleSubmit(finalData);
  };

  const filteredTailors = tailors.filter(
    (t) =>
      t._id !== profile._id &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()))
  );


  return (
    <div className="grid grid-cols-1 gap-2">
      {/* 🔍 Tailor Search */}
      <div>
        <label className="font-semibold">Select Tailor (Optional)</label>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              if (!e.target.value) setSelectedTailorId("");
            }}
            className="border px-3 py-2 rounded w-full mt-1"
          />
          {selectedTailorId && (
            <button
              onClick={() => {
                setSelectedTailorId("");
                setSearch("");
              }}
              className="text-red-600 text-sm font-semibold"
              title="Clear selection"
            >
              ❌
            </button>
          )}
        </div>

        {search.trim().length > 0 && (
          <div className="max-h-52 overflow-y-auto mt-1 border rounded-md shadow bg-white z-10 relative">
            {filteredTailors.length === 0 ? (
              <p className="p-2 text-sm text-gray-500">No tailor found</p>
            ) : (
              filteredTailors.map((tailor) => (
                <div
                  key={tailor._id}
                  onClick={() => {
                    setSelectedTailorId(tailor._id);
                    setSearch(`${tailor.name} (${tailor.email})`);
                  }}
                  className={`flex items-center justify-between px-3 py-2 hover:bg-indigo-100 cursor-pointer ${
                    tailor._id === selectedTailorId ? "bg-indigo-200" : ""
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src={`http://localhost:5000/${tailor.profileImage}`}
                      alt="avatar"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <p className="text-sm font-medium">{tailor.name}</p>
                      <p className="text-xs text-gray-500">{tailor.email}</p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <span
                        key={i}
                        className={`text-xs ${
                          i <=
                          Math.round(tailor.tailorDetails?.averageRating || 0)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      >
                        ★
                      </span>
                    ))}
                    <span className="text-xs text-gray-600">
                      {(tailor.tailorDetails?.averageRating || 0).toFixed(1)}
                    </span>
                  </span>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* New Dropdown for Saved Measurement */}

      <div>
        <label className="font-semibold">Use Saved Measurement</label>
        <select
          className="border px-3 py-2 rounded w-full mt-1"
          value={selectedMeasurementName}
          onChange={(e) => {
            if (e.target.value === "__go_to_measurement") {
              navigate("/measurement");
              return;
            }
            setSelectedMeasurementName(e.target.value);
          }}
        >
          <option value="">-- Select Measurement --</option>

          {measurements.length === 0 ? (
            <option value="__go_to_measurement">➕ Create Measurement</option>
          ) : (
            measurements.map((m) => (
              <option key={m._id} value={m.name}>
                {m.name} ({m.gender})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Upload Image */}
      <input type="file" accept="image/*" onChange={handleFile} />
      {preview && (
        <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />
      )}

      {/* Basic Details */}
      <select name="gender" onChange={handleInput} value={form.gender}>
        <option value="">Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </select>

      <input
        name="budget"
        placeholder="Budget"
        onChange={handleInput}
        value={form.budget}
      />

      <input
        type="date"
        name="duration"
        onChange={handleInput}
        value={form.duration}
        min={getMinDate()}
        required
      />

      <textarea
        name="description"
        placeholder="Description"
        onChange={handleInput}
        value={form.description}
      />

      <input
        name="quantity"
        type="number"
        min="1"
        placeholder="Quantity"
        onChange={handleInput}
        value={form.quantity}
      />

      {/* Male Measurements */}
      {form.gender === "Male" && (
        <>
          <input
            name="measurements.chest"
            placeholder="Chest"
            onChange={handleInput}
            value={form.measurements.chest || ""}
          />
          <input
            name="measurements.shoulderWidth"
            placeholder="Shoulder Width"
            onChange={handleInput}
            value={form.measurements.shoulderWidth || ""}
          />
          <input
            name="measurements.sleeveLength"
            placeholder="Sleeve Length"
            onChange={handleInput}
            value={form.measurements.sleeveLength || ""}
          />
          <input
            name="measurements.shirtLength"
            placeholder="Shirt Length"
            onChange={handleInput}
            value={form.measurements.shirtLength || ""}
          />
          <input
            name="measurements.neck"
            placeholder="Neck"
            onChange={handleInput}
            value={form.measurements.neck || ""}
          />
          <input
            name="measurements.waist"
            placeholder="Waist"
            onChange={handleInput}
            value={form.measurements.waist || ""}
          />
          <input
            name="measurements.hip"
            placeholder="Hip"
            onChange={handleInput}
            value={form.measurements.hip || ""}
          />
          <input
            name="measurements.inseam"
            placeholder="Inseam"
            onChange={handleInput}
            value={form.measurements.inseam || ""}
          />
          <input
            name="measurements.rise"
            placeholder="Rise"
            onChange={handleInput}
            value={form.measurements.rise || ""}
          />
          <input
            name="measurements.thigh"
            placeholder="Thigh"
            onChange={handleInput}
            value={form.measurements.thigh || ""}
          />
        </>
      )}

      {/* Female Measurements */}
      {form.gender === "Female" && (
        <>
          <input
            name="measurements.bust"
            placeholder="Bust"
            onChange={handleInput}
            value={form.measurements.bust || ""}
          />
          <input
            name="measurements.topLength"
            placeholder="Top Length"
            onChange={handleInput}
            value={form.measurements.topLength || ""}
          />
          <input
            name="measurements.waist"
            placeholder="Waist"
            onChange={handleInput}
            value={form.measurements.waist || ""}
          />
          <input
            name="measurements.hip"
            placeholder="Hip"
            onChange={handleInput}
            value={form.measurements.hip || ""}
          />
          <input
            name="measurements.inseam"
            placeholder="Inseam"
            onChange={handleInput}
            value={form.measurements.inseam || ""}
          />
          <input
            name="measurements.rise"
            placeholder="Rise"
            onChange={handleInput}
            value={form.measurements.rise || ""}
          />
          <input
            name="measurements.thigh"
            placeholder="Thigh"
            onChange={handleInput}
            value={form.measurements.thigh || ""}
          />
        </>
      )}

      <button
        onClick={submitForm}
        disabled={isSubmitDisabled || !preview}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Submit
      </button>
    </div>
  );
};

export default RequestUploadForm;
