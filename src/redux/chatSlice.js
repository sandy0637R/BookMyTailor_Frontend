import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: [],
    loading: false,
    error: null,
    chatUser: null,
    chatUsers: [],
    sendMessageLoading: false,
    sendMessageError: null,
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
    setChatUser: (state, action) => {
      state.chatUser = action.payload;
      state.loading = false;
    },
    fetchChatUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChatUsersSuccess: (state, action) => {
      state.loading = false;
      state.chatUsers = action.payload;
    },
    fetchChatUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    updateLastMessageInChatUsers: (state, action) => {
      const { recipientId, message, timestamp } = action.payload;
      const existingUser = state.chatUsers.find(
        (chat) => chat.user._id === recipientId
      );
      if (existingUser) {
        existingUser.lastMessage = message;
        existingUser.timestamp = timestamp;
      } else {
        state.chatUsers.unshift({
          user: { _id: recipientId, name: "New Chat" },
          lastMessage: message,
          timestamp,
        });
      }
    },

    sendMessageRequest: (state) => {
      state.sendMessageLoading = true;
      state.sendMessageError = null;
    },
    sendMessageSuccess: (state) => {
      state.sendMessageLoading = false;
    },
    sendMessageFailure: (state, action) => {
      state.sendMessageLoading = false;
      state.sendMessageError = action.payload;
    },

    // ✅ New reducers for starting chat with user
    startChatWithUserRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
   startChatWithUserSuccess: (state, action) => {
  state.loading = false;
  state.chatUser = action.payload;
},

    startChatWithUserFailure: (state, action) => {
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
  setChatUser,
  fetchChatUsersRequest,
  fetchChatUsersSuccess,
  fetchChatUsersFailure,
  updateLastMessageInChatUsers,
  sendMessageRequest,
  sendMessageSuccess,
  sendMessageFailure,
  startChatWithUserRequest,
  startChatWithUserSuccess,
  startChatWithUserFailure,
} = chatSlice.actions;

export default chatSlice.reducer;
