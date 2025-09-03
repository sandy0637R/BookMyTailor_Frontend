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
    unreadCounts: {},
  },
  reducers: {
    // 📩 Fetch chat
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

    // ➕ Add a new incoming/outgoing message
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    // ✅ Mark messages as read
    markMessagesReadRequest: () => {},
    markMessagesReadSuccess: () => {},
    markMessagesReadFailure: () => {},

    // 🧹 Clear chat history
    clearChat: (state) => {
      state.messages = [];
    },

    // 👤 Set current chat user
    setChatUser: (state, action) => {
      state.chatUser = action.payload;
      state.loading = false;
    },

    // 👥 Fetch chat users
    fetchChatUsersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChatUsersSuccess: (state, action) => {
      state.loading = false;
      const { chatUsers, unreadCounts } = action.payload;
      state.chatUsers = chatUsers || [];
      state.unreadCounts = unreadCounts || {};
    },
    fetchChatUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🔄 Update last message in chat list
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

    // 📨 Sending message
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

    // 💬 Start new chat with a user
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
    addLocalMessage: (state, action) => {
  state.messages.push(action.payload);
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
