// customSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadedRequests: [],
  acceptedRequests: [],
  requestHistory: [],
  directRequests: [],
  timers: {},
  selectedRequest: null,
  showModal: false,
  
};

const customSlice = createSlice({
  name: "custom",
  initialState,
  reducers: {
    setUploadedRequests: (state, action) => {
      state.uploadedRequests = action.payload;
    },
    setAcceptedRequests: (state, action) => {
      state.acceptedRequests = action.payload;
    },
    setRequestHistory: (state, action) => {
      state.requestHistory = action.payload;
    },
    setDirectRequests: (state, action) => {
      state.directRequests = action.payload;
    },
    setTimers: (state, action) => {
      state.timers = action.payload;
    },
    setSelectedRequest: (state, action) => {
      state.selectedRequest = action.payload;
    },
    setShowModal: (state, action) => {
      state.showModal = action.payload;
    },
    
  },
});

export const {
  setUploadedRequests,
  setAcceptedRequests,
  setRequestHistory,
  setDirectRequests,
  setTimers,
  setSelectedRequest,
  setShowModal,

} = customSlice.actions;

export default customSlice.reducer;