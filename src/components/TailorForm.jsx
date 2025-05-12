import React from "react";

const TailorForm = ({ tailorForm, setTailorForm, onSubmit }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <input
      type="number"
      value={tailorForm.experience}
      min="0"
      onChange={(e) =>
        setTailorForm({ ...tailorForm, experience: e.target.value })
      }
      placeholder="Experience"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
    <input
      type="text"
      value={tailorForm.specialization}
      onChange={(e) =>
        setTailorForm({ ...tailorForm, specialization: e.target.value })
      }
      placeholder="Specialization (comma-separated)"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
    <input
      type="number"
      value={tailorForm.fees}
      min="0"
      onChange={(e) => setTailorForm({ ...tailorForm, fees: e.target.value })}
      placeholder="Fees"
      required
      className="w-full px-3 py-2 border border-gray-300 rounded-md"
    />
    <button
      type="submit"
      className="w-full bg-indigo-500 text-white py-2 px-4 rounded-md"
    >
      Submit
    </button>
  </form>
);

export default TailorForm;
