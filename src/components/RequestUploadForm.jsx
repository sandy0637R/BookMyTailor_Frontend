import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMeasurementsRequest } from "../redux/measurementSlice";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";

const RequestUploadForm = ({
  form,
  handleInput,
  handleFile,
  preview,
  isSubmitDisabled,
  handleSubmit,
}) => {
  const dispatch = useDispatch(), navigate = useNavigate();
  const { tailors } = useSelector((s) => s.social);
  const { profile, token } = useSelector((s) => s.auth);
  const { measurements } = useSelector((s) => s.measurement);

  const [selectedTailorId, setSelectedTailorId] = useState("");
  const [search, setSearch] = useState("");
  const [selectedMeasurementName, setSelectedMeasurementName] = useState("");

  const calcMinBudget = (duration, tailorFee = 0) => {
    if (!duration) return tailorFee;
    const d = Math.ceil((new Date(duration) - new Date()) / 86400000);
    if (d < 4) return tailorFee + 1000;
    if (d <= 9) return tailorFee + (10 - d) * 100 + 500;
    return tailorFee + 500;
  };

  useEffect(() => {
    dispatch({ type: "FETCH_TAILORS" });
    token && dispatch(fetchMeasurementsRequest(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (!selectedMeasurementName) return;
    const m = measurements.find((x) => x.name === selectedMeasurementName);
    if (!m) return;
    const e = (n, v) => ({ target: { name: n, value: v } });
    handleInput(e("gender", m.gender));
    Object.entries(m.measurements || {}).forEach(([k, v]) =>
      handleInput(e(`measurements.${k}`, v))
    );
  }, [selectedMeasurementName]);

  useEffect(() => {
    if (!form.gender && !form.duration && !form.budget && !form.description) {
      setSelectedTailorId("");
      setSearch("");
      setSelectedMeasurementName("");
    }
  }, [form]);

  useEffect(() => {
    const t = tailors.find((x) => x._id === selectedTailorId);
    const minBudget = calcMinBudget(form.duration, t?.tailorDetails?.fees || 0);
    if (!form.budget || form.budget < minBudget)
      handleInput({ target: { name: "budget", value: minBudget } });
  }, [selectedTailorId, form.duration, tailors]);

  const getMinDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().split("T")[0];
  };

  const submitForm = () => {
    const diffHours = (new Date(form.duration) - new Date()) / 36e5;
    if (diffHours < 72) return alert("Duration must be at least 3 days (72 hours) from now.");
    handleSubmit({
      ...form,
      quantity: 1,
      submittedAt: new Date().toISOString(),
      ...(selectedTailorId && { tailorId: selectedTailorId }),
    });
  };

  const filteredTailors = tailors.filter(
    (t) =>
      t._id !== profile._id &&
      [t.name, t.email].some((f) => f.toLowerCase().includes(search.toLowerCase()))
  );

  const InputWithUnit = ({ name, placeholder, value, unit }) => (
    <div className="flex items-center border-3 border-brown-primary rounded px-5 py-1 bg-neutral-primary w-[350px] hover:bg-yellow-primary hover-common focus:bg-yellow-primary">
      <input
        name={name}
        type="number"
        placeholder={placeholder}
        onChange={handleInput}
        value={value || ""}
        className="w-full py-1 outline-none text-brown-primary text-[17px] mr-2"
      />
      <span className="text-brown-primary mr-2">{unit}</span>
    </div>
  );

  const Stars = ({ rating }) => (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <span
          key={i}
          className={`text-xs ${
            i <= Math.round(rating || 0) ? "text-yellow-tertiary" : "text-brown-secondary"
          }`}
        >
          ★
        </span>
      ))}
      <span className="text-xs text-brown-tertiary">{(rating || 0).toFixed(1)}</span>
    </>
  );

  const measurementFields = {
    Male: [
      "Chest",
      "Shoulder Width",
      "Sleeve Length",
      "Shirt Length",
      "Neck",
      "Waist",
      "Hip",
      "Inseam",
      "Rise",
      "Thigh",
    ].map((l) => ({ id: l.replace(/\s+/g, "").toLowerCase(), label: l })),
    Female: [
      "Bust",
      "Top Length",
      "Waist",
      "Hip",
      "Inseam",
      "Rise",
      "Thigh",
    ].map((l) => ({ id: l.replace(/\s+/g, "").toLowerCase(), label: l })),
  };

  return (
    <div className="grid grid-cols-1 gap-3 bg-neutral-primary p-4 rounded-lg w-[80%] space-y-4 shadow-common hover-common">
      <h2 className="text-xl font-bold mb-4 text-center text-brown-primary my-8">
        Upload Custom Request
      </h2>

      {/* Upload Image */}
      <div className="flex text-neutral-primary border-3 border-brown-primary mx-7 p-2 rounded-sm bg-brown-secondary justify-between items-center px-5">
        <input type="file" id="image" accept="image/*" onChange={handleFile} className="w-full" />
        <label htmlFor="image"><MdOutlinePhotoSizeSelectActual /></label>
      </div>
      {preview && (
        <div className="ml-8">
          <img src={preview} alt="Preview" className="w-60 h-60 object-cover border-4 border-brown-primary rounded m-1" />
        </div>
      )}

      {/* Tailor Selection */}
      <div className="mx-7">
        <label className="font-semibold text-brown-secondary">Select Tailor (Optional)</label>
        {selectedTailorId ? (
          (() => {
            const t = tailors.find((x) => x._id === selectedTailorId);
            if (!t) return null;
            return (
              <div className="flex items-center justify-between border border-brown-primary rounded p-3 bg-yellow-primary mt-2">
                <div className="flex items-center gap-3">
                  <img src={`http://localhost:5000/${t.profileImage}`} alt="avatar" className="w-12 h-12 rounded-full object-cover border border-brown-tertiary" />
                  <div>
                    <p className="font-medium text-brown-tertiary">{t.name}</p>
                    <p className="text-sm text-brown-secondary">{t.email}</p>
                    <div className="flex items-center gap-1 text-yellow-tertiary"><Stars rating={t.tailorDetails?.averageRating} /></div>
                  </div>
                </div>
                <button onClick={() => { setSelectedTailorId(""); setSearch(""); }} className="text-danger-primary font-semibold text-sm">❌ Remove</button>
              </div>
            );
          })()
        ) : (
          <>
            <input
              type="text"
              placeholder="Search by name or email"
              value={search}
              onChange={(e) => { setSearch(e.target.value); !e.target.value && setSelectedTailorId(""); }}
              className="border-3 border-brown-primary px-3 py-2 rounded w-full mt-1 bg-neutral-primary text-brown-primary focus:outline-none"
            />
            {search.trim() && (
              <div className="max-h-52 overflow-y-auto mt-1 border-3 border-brown-primary text-brown-primary rounded-md shadow bg-neutral-primary z-10 relative">
                {filteredTailors.length ? (
                  filteredTailors.map((t) => (
                    <div
                      key={t._id}
                      onClick={() => { setSelectedTailorId(t._id); setSearch(`${t.name} (${t.email})`); }}
                      className="flex items-center justify-between px-3 py-2 hover:bg-yellow-secondary cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <img src={`http://localhost:5000/${t.profileImage}`} alt="avatar" className="w-8 h-8 rounded-full object-cover border border-brown-primary" />
                        <div>
                          <p className="text-sm font-medium text-brown-tertiary">{t.name}</p>
                          <p className="text-xs text-brown-secondary">{t.email}</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1"><Stars rating={t.tailorDetails?.averageRating} /></span>
                    </div>
                  ))
                ) : (
                  <p className="p-2 text-sm text-brown-secondary">No tailor found</p>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Duration & Budget */}
      <div className="flex ml-7">
        <input type="date" name="duration" onChange={handleInput} value={form.duration} min={getMinDate()} required className="border-3 border-brown-secondary px-3 py-2 rounded bg-yellow-primary text-brown-tertiary mr-15" />
        <div className="flex items-center border-3 border-brown-primary rounded px-2 bg-neutral-primary">
          <span className="text-brown-primary mr-2">Rs</span>
          <input
            name="budget"
            type="number"
            step="100"
            min={calcMinBudget(form.duration, tailors.find((x) => x._id === selectedTailorId)?.tailorDetails?.fees || 0)}
            placeholder="Budget"
            onChange={(e) => {
              const v = +e.target.value, min = calcMinBudget(form.duration, tailors.find((x) => x._id === selectedTailorId)?.tailorDetails?.fees || 0);
              if (v >= min && v % 100 === 0) handleInput(e);
            }}
            value={form.budget}
            className="w-full py-1 outline-none bg-neutral-primary text-brown-primary"
          />
        </div>
      </div>

      {/* Description */}
      <textarea
        name="description"
        placeholder="Description"
        onChange={handleInput}
        value={form.description}
        className="border-3 border-brown-primary px-3 py-2 mx-7 rounded bg-neutral-primary text-brown-primary hover-common hover:bg-yellow-primary focus:outline-none"
      />

      {/* Saved Measurement, Gender, Qty */}
      <div className="flex flex-wrap mx-7 items-baseline-last">
        <div className="mr-20">
          <label className="font-semibold text-brown-secondary">Use Saved Measurement</label>
          <select
            className="px-3 py-2 h-[40px] rounded w-full mt-1 border-3 border-brown-primary text-neutral-primary bg-brown-secondary hover-common hover:bg-brown-primary"
            value={selectedMeasurementName}
            onChange={(e) => e.target.value === "__go_to_measurement" ? navigate("/measurement") : setSelectedMeasurementName(e.target.value)}
          >
            <option value="">Select Measurement</option>
            {measurements.length ? (
              measurements.map((m) => <option key={m._id} value={m.name}>{m.name} ({m.gender})</option>)
            ) : (
              <option value="__go_to_measurement">+ Create Measurement</option>
            )}
          </select>
        </div>
        <select
          name="gender"
          onChange={handleInput}
          value={form.gender}
          className="border-3 border-brown-secondary px-3 py-2 h-[40px] rounded text-neutral-primary bg-brown-primary mr-20"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <div>
          <input type="number" value={1} disabled className="rounded text-brown-primary h-[40px] w-6 text-xl font-bold" />
          <span className="font-semibold ml-1">:Qty</span>
        </div>
      </div>

      {/* Measurements Section */}
      {form.gender && (
        <div className="flex flex-col justify-center items-center mt-5">
          <h1 className="text-2xl text-brown-secondary font-bold">Measurements</h1>
          <div className="flex flex-wrap w-full px-5">
            {measurementFields[form.gender].map((f) => (
              <div key={f.id} className="customize-m-in-main-div">
                <label htmlFor={f.id} className="customize-m-in-label">{f.label}:</label>
                <InputWithUnit name={`measurements.${f.id}`} placeholder={f.label} value={form.measurements?.[f.id]} unit="cm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit */}
      <button onClick={submitForm} disabled={isSubmitDisabled || !preview} className="bg-brown-primary text-neutral-primary px-4 py-2 rounded hover:bg-brown-secondary transition disabled:opacity-50 mx-7 mb-15 mt-5">
        Submit
      </button>
    </div>
  );
};

export default RequestUploadForm;