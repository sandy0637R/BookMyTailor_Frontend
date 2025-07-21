// measurementSlice.js
import { createSlice } from "@reduxjs/toolkit";

const measurementSlice = createSlice({
  name: "measurement",
  initialState: {
    measurements: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchMeasurementsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMeasurementsSuccess: (state, action) => {
      state.loading = false;
      state.measurements = action.payload;
    },
    fetchMeasurementsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addMeasurementRequest: (state) => {
      state.loading = true;
    },
    addMeasurementSuccess: (state) => {
      state.loading = false;
    },
    addMeasurementFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    deleteMeasurementRequest: (state) => {
      state.loading = true;
    },
    deleteMeasurementSuccess: (state) => {
      state.loading = false;
    },
    deleteMeasurementFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateMeasurementRequest: (state) => {
      state.loading = true;
    },
    updateMeasurementSuccess: (state) => {
      state.loading = false;
    },
    updateMeasurementFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchMeasurementsRequest,
  fetchMeasurementsSuccess,
  fetchMeasurementsFailure,
  addMeasurementRequest,
  addMeasurementSuccess,
  addMeasurementFailure,
  deleteMeasurementRequest,
  deleteMeasurementSuccess,
  deleteMeasurementFailure,
  updateMeasurementRequest,
  updateMeasurementSuccess,
  updateMeasurementFailure,
} = measurementSlice.actions;

export default measurementSlice.reducer;
