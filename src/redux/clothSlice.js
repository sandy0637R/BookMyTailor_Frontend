import { createSlice } from "@reduxjs/toolkit";

const clothSlice = createSlice({
  name: "cloth",
  initialState: {
    cloths: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchClothsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchClothsSuccess: (state, action) => {
      state.loading = false;
      state.cloths = action.payload;
    },
    fetchClothsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    addClothRequest: () => {},
    addClothSuccess: () => {},
    addClothFailure: () => {},

    updateClothRequest: () => {},
    updateClothSuccess: () => {},
    updateClothFailure: () => {},

    deleteClothRequest: () => {},
    deleteClothSuccess: () => {},
    deleteClothFailure: () => {},
  },
});

export const {
  fetchClothsRequest,
  fetchClothsSuccess,
  fetchClothsFailure,

  addClothRequest,
  addClothSuccess,
  addClothFailure,

  updateClothRequest,
  updateClothSuccess,
  updateClothFailure,

  deleteClothRequest,
  deleteClothSuccess,
  deleteClothFailure,
} = clothSlice.actions;

export default clothSlice.reducer;
