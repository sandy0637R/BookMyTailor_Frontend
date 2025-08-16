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

  // Prefill measurements when a saved measurement is chosen
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

  // Reset when form resets
  useEffect(() => {
    if (!form.gender && !form.duration && !form.budget && !form.description) {
      setSelectedTailorId("");
      setSearch("");
      setSelectedMeasurementName("");
    }
  }, [form]);

  // Auto-calculate budget whenever tailor/duration changes
  useEffect(() => {
    const calculateBudget = () => {
      let tailorFee = 0;
      if (selectedTailorId) {
        const t = tailors.find((x) => x._id === selectedTailorId);
        if (t) tailorFee = t.tailorDetails?.fees || 0;
      }

      let durationFee = 0;
      if (form.duration) {
        const today = new Date();
        const selected = new Date(form.duration);
        const diffDays = Math.ceil((selected - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 4) {
          durationFee = 1000;
        } else if (diffDays >= 4 && diffDays <= 9) {
          durationFee = (10 - diffDays) * 100 + 500;
        } else if (diffDays > 10) {
          durationFee = 500;
        }
      }

      const minBudget = tailorFee + durationFee;
      const currentBudget = Number(form.budget) || 0;

      const finalBudget = currentBudget < minBudget ? minBudget : currentBudget;
      handleInput({ target: { name: "budget", value: finalBudget } });
    };

    calculateBudget();
  }, [selectedTailorId, form.duration, tailors]);

  // Helper for date input (min date = today + 3 days)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 3);
    const offset = date.getTimezoneOffset();
    date.setMinutes(date.getMinutes() - offset);
    return date.toISOString().split("T")[0];
  };

  // Final submit handler
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
      quantity: 1,
      submittedAt: today,
      ...(selectedTailorId && { tailorId: selectedTailorId }),
    };
    handleSubmit(finalData);
  };

  // Filtered tailors for search dropdown
  const filteredTailors = tailors.filter(
    (t) =>
      t._id !== profile._id &&
      (t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.email.toLowerCase().includes(search.toLowerCase()))
  );

  // Reusable input with unit
  const InputWithUnit = ({ name, placeholder, value, unit }) => (
    <div className="flex items-center border-3 border-brown-primary rounded px-5 py-1 bg-neutral-primary w-[350px] hover:bg-yellow-primary hover-common focus:bg-yellow-primary">
      <input
        name={name}
        type="number"
        placeholder={placeholder}
        onChange={handleInput}
        value={value || ""}
        className="w-full py-1 outline-none  text-brown-primary text-[17px] mr-2"
      />
      <span className="text-brown-primary mr-2">{unit}</span>
    </div>
  );

  return (
    <div className="grid grid-cols-1 gap-3 bg-neutral-primary p-4 rounded-lg w-[80%] space-y-4 shadow-common hover-common">
      <h2 className="text-xl font-bold mb-4 text-center text-brown-primary my-8">
        Upload Custom Request
      </h2>
      <div className="flex text-neutral-primary border-3 border-brown-primary mx-7 p-2 rounded-sm bg-brown-secondary justify-between items-center px-5">
      {/* Upload Image */}
      <input
        type="file"
        id="image"
        accept="image/*"
        onChange={handleFile}
        className="w-full"
      />
      <label htmlFor="image"><MdOutlinePhotoSizeSelectActual /></label></div>
      {preview && (
        <div className="ml-8"><img
          src={preview}
          alt="Preview"
          className="w-60 h-60 object-cover border-4 border-brown-primary rounded m-1  "
        /></div>
      )}
      {/* Tailor Selection */}
      <div className="mx-7">
        <label className="font-semibold text-brown-secondary">
          Select Tailor (Optional)
        </label>

        {selectedTailorId ? (
          (() => {
            const t = tailors.find((x) => x._id === selectedTailorId);
            if (!t) return null;
            return (
              <div className="flex items-center justify-between border border-brown-primary rounded p-3 bg-yellow-primary mt-2">
                <div className="flex items-center gap-3">
                  <img
                    src={`http://localhost:5000/${t.profileImage}`}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover border border-brown-tertiary"
                  />
                  <div>
                    <p className="font-medium text-brown-tertiary">{t.name}</p>
                    <p className="text-sm text-brown-secondary">{t.email}</p>
                    <div className="flex items-center gap-1 text-yellow-tertiary">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`text-xs ${
                            i <= Math.round(t.tailorDetails?.averageRating || 0)
                              ? "text-yellow-tertiary"
                              : "text-brown-secondary"
                          }`}
                        >
                          ★
                        </span>
                      ))}
                      <span className="text-xs text-brown-tertiary">
                        {(t.tailorDetails?.averageRating || 0).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedTailorId("");
                    setSearch("");
                  }}
                  className="text-danger-primary font-semibold text-sm"
                >
                  ❌ Remove
                </button>
              </div>
            );
          })()
        ) : (
          <>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (!e.target.value) setSelectedTailorId("");
                }}
                className="border-3 border-brown-primary px-3 py-2 rounded w-full mt-1 bg-neutral-primary text-brown-primary focus:outline-none"
              />
            </div>

            {search.trim().length > 0 && (
              <div className="max-h-52 overflow-y-auto mt-1 border-3 border-brown-primary text-brown-primary rounded-md shadow bg-neutral-primary z-10 relative">
                {filteredTailors.length === 0 ? (
                  <p className="p-2 text-sm text-brown-secondary">
                    No tailor found
                  </p>
                ) : (
                  filteredTailors.map((tailor) => (
                    <div
                      key={tailor._id}
                      onClick={() => {
                        setSelectedTailorId(tailor._id);
                        setSearch(`${tailor.name} (${tailor.email})`);
                      }}
                      className="flex items-center justify-between px-3 py-2 hover:bg-yellow-secondary cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={`http://localhost:5000/${tailor.profileImage}`}
                          alt="avatar"
                          className="w-8 h-8 rounded-full object-cover border border-brown-primary"
                        />
                        <div>
                          <p className="text-sm font-medium text-brown-tertiary">
                            {tailor.name}
                          </p>
                          <p className="text-xs text-brown-secondary">
                            {tailor.email}
                          </p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <span
                            key={i}
                            className={`text-xs ${
                              i <=
                              Math.round(
                                tailor.tailorDetails?.averageRating || 0
                              )
                                ? "text-yellow-tertiary"
                                : "text-brown-secondary"
                            }`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="text-xs text-brown-tertiary">
                          {(tailor.tailorDetails?.averageRating || 0).toFixed(
                            1
                          )}
                        </span>
                      </span>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

     <div className="flex ml-7">
       {/* Duration */}
      <input
        type="date"
        name="duration"
        onChange={handleInput}
        value={form.duration}
        min={getMinDate()}
        required
        className="border-3 border-brown-secondary px-3 py-2 rounded bg-yellow-primary text-brown-tertiary mr-15"
      />
      {/* Budget */}
      <div className="flex items-center border-3 border-brown-primary rounded px-2 bg-neutral-primary">
        <span className="text-brown-primary mr-2">Rs</span>
        <input
          name="budget"
          type="number"
          step="100"
          min={form.budget}
          placeholder="Budget"
          onChange={(e) => {
            const value = Number(e.target.value);
            if (value >= form.budget && value % 100 === 0) {
              handleInput(e);
            }
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
        className="border-3 border-brown-primary px-3 py-2 mx-7 rounded bg-neutral-primary   text-brown-primary hover-common hover:bg-yellow-primary focus:outline-none"
      />
      

      <div className="flex flex-wrap mx-7  items-baseline-last">
        {/* Saved Measurement Dropdown */}
      <div className="mr-20">
        <label className="font-semibold text-brown-secondary">
          Use Saved Measurement
        </label>
        <select
          className=" px-3 py-2 h-[40px] rounded w-full mt-1 border-3 border-brown-primary text-neutral-primary bg-brown-secondary hover-common hover:bg-brown-primary"
          value={selectedMeasurementName}
          onChange={(e) => {
            if (e.target.value === "__go_to_measurement") {
              navigate("/measurement");
              return;
            }
            setSelectedMeasurementName(e.target.value);
          }}
        >
          <option value="">Select Measurement</option>
          {measurements.length === 0 ? (
            <option value="__go_to_measurement">+ Create Measurement</option>
          ) : (
            measurements.map((m) => (
              <option key={m._id} value={m.name}>
                {m.name} ({m.gender})
              </option>
            ))
          )}
        </select>
      </div>

      {/* Gender */}
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

      {/* Quantity (Fixed at 1) */}
      <div><input
        name="quantity"
        type="number"
        value={1}
        disabled
        className=" rounded  text-brown-primary h-[40px] w-6 text-xl font-bold"
      /> <span className="font-semibold ml-1">:Qty</span></div>
      </div>

      {/* Male/Female measurements */}
      {form.gender === "Male" && (
        <div className="flex flex-col justify-center items-center mt-5">
          <div>
            <h1 className="text-2xl text-brown-secondary font-bold">
              MeasureMents
            </h1>
          </div>
          <div>
            <div className="flex flex-wrap w-full px-5">
              <div className="customize-m-in-main-div">
                <label htmlFor="chest" className="customize-m-in-label">
                  Chest:
                </label>
                <InputWithUnit
                  id="chest"
                  name="measurements.chest"
                  placeholder="Chest"
                  value={form.measurements.chest || ""}
                  unit="cm"
                />
              </div>
              <div className="customize-m-in-main-div">
                <label htmlFor="shoulderw" className="customize-m-in-label">
                  Sholder Width:
                </label>
                <InputWithUnit
                  id="shoulderw"
                  name="measurements.shoulderWidth"
                  placeholder="Shoulder Width"
                  value={form.measurements.shoulderWidth || ""}
                  unit="cm"
                />
              </div>
              <div className="customize-m-in-main-div">
                <label htmlFor="sleeveLength" className="customize-m-in-label">
                  Sleeve Length:
                </label>
                <InputWithUnit
                  id="sleeveLength"
                  name="measurements.sleeveLength"
                  placeholder="Sleeve Length"
                  value={form.measurements.sleeveLength || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="shirtLength" className="customize-m-in-label">
                  Shirt Length:
                </label>
                <InputWithUnit
                  id="shirtLength"
                  name="measurements.shirtLength"
                  placeholder="Shirt Length"
                  value={form.measurements.shirtLength || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="neck" className="customize-m-in-label">
                  Neck:
                </label>
                <InputWithUnit
                  id="neck"
                  name="measurements.neck"
                  placeholder="Neck"
                  value={form.measurements.neck || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="waist" className="customize-m-in-label">
                  Waist:
                </label>
                <InputWithUnit
                  id="waist"
                  name="measurements.waist"
                  placeholder="Waist"
                  value={form.measurements.waist || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="hip" className="customize-m-in-label">
                  Hip:
                </label>
                <InputWithUnit
                  id="hip"
                  name="measurements.hip"
                  placeholder="Hip"
                  value={form.measurements.hip || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="inseam" className="customize-m-in-label">
                  Inseam:
                </label>
                <InputWithUnit
                  id="inseam"
                  name="measurements.inseam"
                  placeholder="Inseam"
                  value={form.measurements.inseam || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="rise" className="customize-m-in-label">
                  Rise:
                </label>
                <InputWithUnit
                  id="rise"
                  name="measurements.rise"
                  placeholder="Rise"
                  value={form.measurements.rise || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="thigh" className="customize-m-in-label">
                  Thigh:
                </label>
                <InputWithUnit
                  id="thigh"
                  name="measurements.thigh"
                  placeholder="Thigh"
                  value={form.measurements.thigh || ""}
                  unit="cm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {form.gender === "Female" && (
        <div className="flex flex-col justify-center items-center mt-5">
          <div>
            <h1 className="text-2xl text-brown-secondary font-bold">
              Measurements
            </h1>
          </div>
          <div>
            <div className="flex flex-wrap px-5">
              <div className="customize-m-in-main-div">
                <label htmlFor="bust" className="customize-m-in-label">
                  Bust
                </label>
                <InputWithUnit
                  id="bust"
                  name="measurements.bust"
                  placeholder="Bust"
                  value={form.measurements.bust || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="topLength" className="customize-m-in-label">
                  Top Length
                </label>
                <InputWithUnit
                  id="topLength"
                  name="measurements.topLength"
                  placeholder="Top Length"
                  value={form.measurements.topLength || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="waist" className="customize-m-in-label">
                  Waist
                </label>
                <InputWithUnit
                  id="waist"
                  name="measurements.waist"
                  placeholder="Waist"
                  value={form.measurements.waist || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="hip" className="customize-m-in-label">
                  Hip
                </label>
                <InputWithUnit
                  id="hip"
                  name="measurements.hip"
                  placeholder="Hip"
                  value={form.measurements.hip || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="inseam" className="customize-m-in-label">
                  Inseam
                </label>
                <InputWithUnit
                  id="inseam"
                  name="measurements.inseam"
                  placeholder="Inseam"
                  value={form.measurements.inseam || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="rise" className="customize-m-in-label">
                  Rise
                </label>
                <InputWithUnit
                  id="rise"
                  name="measurements.rise"
                  placeholder="Rise"
                  value={form.measurements.rise || ""}
                  unit="cm"
                />
              </div>

              <div className="customize-m-in-main-div">
                <label htmlFor="thigh" className="customize-m-in-label">
                  Thigh
                </label>
                <InputWithUnit
                  id="thigh"
                  name="measurements.thigh"
                  placeholder="Thigh"
                  value={form.measurements.thigh || ""}
                  unit="cm"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        onClick={submitForm}
        disabled={isSubmitDisabled || !preview}
        className="bg-brown-primary text-neutral-primary px-4 py-2 rounded hover:bg-brown-secondary transition disabled:opacity-50 mx-7 mb-15 mt-5"
      >
        Submit
      </button>
    </div>
  );
};

export default RequestUploadForm;
