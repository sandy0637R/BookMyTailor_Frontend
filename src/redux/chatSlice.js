import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    chatUser: null, // 👈 added here
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
} = chatSlice.actions;

export default chatSlice.reducer;
