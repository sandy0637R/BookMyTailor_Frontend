import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    chatUser: null, // 👈 added here
    chatUsers: [], // 👈 added here
  },
  reducers: {
    fetchChatRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChatSuccess: (state, action) => {
      state.loading = false;
      state.messages = action.payload;
    },
    fetchChatFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    markMessagesReadRequest: () => {},
    markMessagesReadSuccess: () => {},
    markMessagesReadFailure: () => {},
    clearChat: (state) => {
      state.messages = [];
    },
    setChatUser: (state, action) => {  // 👈 added here
      state.chatUser = action.payload;
      state.loading = false; 
    },
    fetchChatUsersRequest: (state) => {  // ✅ REQUIRED for saga to listen
      state.loading = true;
      state.error = null;
    },
    fetchChatUsersSuccess: (state, action) => { // 👈 added here
      state.loading = false;
      state.chatUsers = action.payload;
    },
    fetchChatUsersFailure: (state, action) => { // 👈 added here
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  fetchChatRequest,
  fetchChatSuccess,
  fetchChatFailure,
  addMessage,
  markMessagesReadRequest,
  markMessagesReadSuccess,
  markMessagesReadFailure,
  clearChat,
  setChatUser, // 👈 added here
  fetchChatUsersRequest, // ✅ now included here
  fetchChatUsersSuccess, // 👈 added here
  fetchChatUsersFailure, // 👈 added here
} = chatSlice.actions;

export default chatSlice.reducer;
