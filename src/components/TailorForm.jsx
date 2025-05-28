import React, { useState, useEffect, useRef } from "react";

const SPECIALIZATIONS = [
  "Classic Tailoring",
  "Modern/Contemporary Tailoring",
  "Bridal and Wedding Tailoring",
  "Menswear Tailoring",
  "Womenswear Tailoring",
  "Casual Wear Tailoring",
  "Formal Wear Tailoring",
  "Costume and Theatrical Tailoring",
  "Sportswear Tailoring",
  "Custom Suit Tailoring",
  "Alterations and Repairs",
  "Ethnic/Traditional Clothing Tailoring",
  "Children’s Wear Tailoring",
  "Luxury or Couture Tailoring",
  "Uniform Tailoring",
  "Other",
];

const PAGE_SIZE = 3;
const MAX_DESCRIPTION_WORDS = 100;

const TailorForm = ({ tailorForm, setTailorForm, onSubmit }) => {
  const [visibleOptions, setVisibleOptions] = useState(SPECIALIZATIONS.slice(0, PAGE_SIZE));
  const [page, setPage] = useState(1);
  const [customSpec, setCustomSpec] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedSpecialization, setSelectedSpecialization] = useState([]);
  const [description, setDescription] = useState(tailorForm.description || "");



  useEffect(() => {
    if (tailorForm.experience === undefined || tailorForm.experience === "") {
      setTailorForm((prev) => ({ ...prev, experience: 0 }));
    }
    if (tailorForm.fees === undefined || tailorForm.fees === "") {
      setTailorForm((prev) => ({ ...prev, fees: 100 }));
    }
  }, []);

  useEffect(() => {
    if (tailorForm.specialization) {
      const specs = tailorForm.specialization.split(",").map((s) => s.trim()).filter(Boolean);
      setSelectedSpecialization(specs);
    } else {
      setSelectedSpecialization([]);
    }
  }, [tailorForm.specialization]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const addSpecialization = (spec) => {
    if (spec === "Other") {
      setShowCustomInput(true);
      return;
    }

    if (!selectedSpecialization.includes(spec)) {
      const newSpecs = [...selectedSpecialization, spec];
      setSelectedSpecialization(newSpecs);
      setTailorForm({
        ...tailorForm,
        specialization: newSpecs.join(", "),
      });
    }
  };

  const removeSpecialization = (spec) => {
    const newSpecs = selectedSpecialization.filter((s) => s !== spec);
    setSelectedSpecialization(newSpecs);
    setTailorForm({
      ...tailorForm,
      specialization: newSpecs.join(", "),
    });
  };

  const submitCustomSpec = () => {
    const trimmed = customSpec.trim();
    if (trimmed && !selectedSpecialization.includes(trimmed)) {
      const newSpecs = [...selectedSpecialization, trimmed];
      setSelectedSpecialization(newSpecs);
      setTailorForm({
        ...tailorForm,
        specialization: newSpecs.join(", "),
      });
      setCustomSpec("");
      setShowCustomInput(false);
    }
  };

  const incrementExperience = () => {
    const newVal = Number(tailorForm.experience) + 1;
    setTailorForm({ ...tailorForm, experience: newVal });
  };

  const decrementExperience = () => {
    const newVal = Math.max(0, Number(tailorForm.experience) - 1);
    setTailorForm({ ...tailorForm, experience: newVal });
  };

  const incrementFees = () => {
    const newVal = Number(tailorForm.fees) + 100;
    setTailorForm({ ...tailorForm, fees: newVal });
  };

  const decrementFees = () => {
    const newVal = Math.max(0, Number(tailorForm.fees) - 100);
    setTailorForm({ ...tailorForm, fees: newVal });
  };

  const handleFeesChange = (e) => {
    const val = e.target.value;
    if (val === "" || /^\d+$/.test(val)) {
      setTailorForm({ ...tailorForm, fees: val === "" ? "" : Number(val) });
    }
  };

  const handleDescriptionChange = (e) => {
    const val = e.target.value;
    const words = val.trim().split(/\s+/);
    if (val === "" || words.length <= MAX_DESCRIPTION_WORDS) {
      setDescription(val);
      setTailorForm({ ...tailorForm, description: val });
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Experience (years)</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrementExperience}
            className="px-3 py-1 bg-gray-200 rounded"
            aria-label="Decrease experience"
          >
            -
          </button>
          <input
            type="number"
            value={tailorForm.experience}
            min="0"
            readOnly
            className="w-16 text-center border border-gray-300 rounded-md py-2"
          />
          <button
            type="button"
            onClick={incrementExperience}
            className="px-3 py-1 bg-gray-200 rounded"
            aria-label="Increase experience"
          >
            +
          </button>
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">
          Description (max 100 words)
        </label>
        <textarea
          value={description}
          onChange={handleDescriptionChange}
          placeholder="Describe your tailoring services"
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
        <div className="text-sm text-gray-500 text-right">
          {description.trim() === "" ? 0 : description.trim().split(/\s+/).length}/100 words
        </div>
      </div>

      <div className="relative">
        <label className="block mb-1 font-medium">Specialization (select multiple)</label>

        <div className="flex flex-wrap gap-1 mb-1">
          {selectedSpecialization.map((spec) => (
            <div
              key={spec}
              className="bg-indigo-200 text-indigo-800 px-2 py-0.5 rounded-full flex items-center gap-1"
            >
              <span>{spec}</span>
              <button
                type="button"
                onClick={() => removeSpecialization(spec)}
                className="text-indigo-600 font-bold"
                aria-label={`Remove ${spec}`}
              >
                &times;
              </button>
            </div>
          ))}
        </div>

        <input
          type="text"
          readOnly
          onClick={toggleDropdown}
          value={dropdownOpen ? "Select specialization..." : ""}
          placeholder="Select specialization..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md cursor-pointer"
        />

     {dropdownOpen && (
  <div className="absolute z-10 mt-1 w-full border border-gray-300 bg-white rounded-md shadow-lg">
    <div className="flex justify-between p-2 bg-gray-100 items-center">
  <button
    type="button"
    disabled={page === 1}
    onClick={() => {
      const newPage = Math.max(1, page - 1);
      setPage(newPage);
      const start = (newPage - 1) * PAGE_SIZE;
      setVisibleOptions(SPECIALIZATIONS.slice(start, start + PAGE_SIZE));
    }}
    className={`text-lg font-bold px-3 py-1 rounded ${
      page === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"
    }`}
  >
    ▲
  </button>
  <button
    type="button"
    disabled={page * PAGE_SIZE >= SPECIALIZATIONS.length}
    onClick={() => {
      const newPage = page + 1;
      setPage(newPage);
      const start = (newPage - 1) * PAGE_SIZE;
      setVisibleOptions(SPECIALIZATIONS.slice(start, start + PAGE_SIZE));
    }}
    className={`text-lg font-bold px-3 py-1 rounded ${
      page * PAGE_SIZE >= SPECIALIZATIONS.length
        ? "opacity-50 cursor-not-allowed"
        : "hover:bg-gray-200"
    }`}
  >
    ▼
  </button>
</div>

    {visibleOptions.map((spec) => (
      <div
        key={spec}
        onClick={() => {
          addSpecialization(spec);
          setDropdownOpen(false);
        }}
        className="px-3 py-2 hover:bg-indigo-100 cursor-pointer"
      >
        {spec}
      </div>
    ))}
  </div>
)}

      </div>

      {showCustomInput && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={customSpec}
            onChange={(e) => setCustomSpec(e.target.value)}
            placeholder="Enter custom specialization"
            className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
          />
          <button
            type="button"
            onClick={submitCustomSpec}
            className="bg-indigo-500 text-white px-4 py-2 rounded-md"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => {
              setShowCustomInput(false);
              setCustomSpec("");
            }}
            className="bg-gray-300 px-4 py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      )}

      <div>
        <label className="block mb-1 font-medium">Fees</label>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={decrementFees}
            className="px-3 py-1 bg-gray-200 rounded"
            aria-label="Decrease fees"
          >
            -
          </button>
          <input
            type="text"
            value={tailorForm.fees}
            onChange={handleFeesChange}
            placeholder="Fees"
            className="w-24 text-center border border-gray-300 rounded-md py-2"
          />
          <button
            type="button"
            onClick={incrementFees}
            className="px-3 py-1 bg-gray-200 rounded"
            aria-label="Increase fees"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md"
      >
        Submit
      </button>
    </form>
  );
};

export default TailorForm; 