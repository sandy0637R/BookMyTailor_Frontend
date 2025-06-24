import React from 'react'

const RequestUploadForm = () => {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Upload Custom Request</h2>

      <div className="grid grid-cols-1 gap-2">
        <input type="file" accept="image/*" onChange={handleFile} />
        {preview && (
          <img src={preview} alt="Preview" className="w-32 h-32 object-cover" />
        )}
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
        {/* Dynamic Measurements */}
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
          onClick={handleSubmit}
          disabled={isSubmitDisabled}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          Submit
        </button>
      </div>
    </div>
  )
}

export default RequestUploadForm
