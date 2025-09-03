import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import {
  fetchChatRequest,
  fetchChatSuccess,
  fetchChatFailure,
  markMessagesReadSuccess,
  markMessagesReadFailure,
  fetchChatUsersRequest,
  fetchChatUsersSuccess,
  fetchChatUsersFailure,
  sendMessageSuccess,
  sendMessageFailure,
  startChatWithUserRequest,
  startChatWithUserSuccess,
  startChatWithUserFailure,
} from "./chatSlice";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

// ✅ Helper: check valid Mongo ObjectId
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

// 📩 Fetch conversation messages
function* fetchChatSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);

    // Support both styles of payload
    let { userId1, userId2, currentUserId, selectedUserId } = action.payload;

    const senderId = String(userId1 || currentUserId);
    const receiverId = String(userId2 || selectedUserId);

    if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
      console.error("⚠️ Invalid IDs passed to fetchChatSaga:", {
        senderId,
        receiverId,
      });
      yield put(fetchChatFailure("Invalid user IDs"));
      return;
    }

    const { data } = yield call(
      axios.get,
      `${BASE_URL}/api/chat/conversation/${senderId}/${receiverId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    yield put(fetchChatSuccess(data));
  } catch (error) {
    console.error("❌ fetchChatSaga error:", error.message);
    yield put(fetchChatFailure(error.message));
    toast.error("Failed to load chat messages");
  }
}

// ✅ Mark messages as read
function* markMessagesReadSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    let messageIds = action.payload || [];

    // 🔍 Filter only valid ObjectIds
    messageIds = messageIds.filter((id) => isValidObjectId(String(id)));

    if (messageIds.length === 0) {
      console.warn("⚠️ No valid messageIds to mark as read");
      return;
    }

    yield call(
      axios.put,
      `${BASE_URL}/api/chat/mark-read`,
      { messageIds },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    yield put(markMessagesReadSuccess());
  } catch (error) {
    console.error("❌ markMessagesReadSaga error:", error.message);
    yield put(markMessagesReadFailure(error.message));
  }
}

// 👥 Fetch chat user list
function* fetchChatUsersSaga() {
  try {
    const token = yield select((state) => state.auth.token);

    const { data } = yield call(axios.get, `${BASE_URL}/api/chat/chat-users`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    yield put(fetchChatUsersSuccess(data));
  } catch (error) {
    console.error("❌ fetchChatUsersSaga error:", error.message);
    yield put(fetchChatUsersFailure(error.message));
    toast.error("Failed to load chat users");
  }
}

// 📨 Send message saga
function* sendMessageSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    let { senderId, receiverId, message } = action.payload;

    senderId = String(senderId);
    receiverId = String(receiverId);

    if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
      throw new Error("Invalid sender or receiver ID");
    }

    yield call(
      axios.post,
      `${BASE_URL}/api/chat/send`,
      { sender: senderId, receiver: receiverId, message },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    yield put(sendMessageSuccess());
    yield put(fetchChatUsersRequest()); // refresh user list
  } catch (error) {
    console.error("❌ sendMessageSaga error:", error.message);
    yield put(sendMessageFailure(error.message));
    toast.error("Failed to send message");
  }
}

// 💬 Start chat saga
function* startChatWithUserSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    let { senderId, receiverId } = action.payload;

    senderId = String(senderId);
    receiverId = String(receiverId);

    if (!isValidObjectId(senderId) || !isValidObjectId(receiverId)) {
      throw new Error("Invalid sender or receiver ID");
    }

    yield call(
      axios.post,
      `${BASE_URL}/api/chat/start`,
      { sender: senderId, receiver: receiverId },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    yield put(startChatWithUserSuccess({ _id: receiverId }));
    yield put(fetchChatUsersRequest());
  } catch (error) {
    console.error("❌ startChatWithUserSaga error:", error.message);
    yield put(startChatWithUserFailure(error.message));
    toast.error("Failed to start chat");
  }
}

// 👀 Watcher saga
export function* watchChat() {
  yield takeLatest(fetchChatRequest.type, fetchChatSaga);
  yield takeLatest("chat/markMessagesReadRequest", markMessagesReadSaga);
  yield takeLatest(fetchChatUsersRequest.type, fetchChatUsersSaga);
  yield takeLatest("chat/sendMessageRequest", sendMessageSaga);
  yield takeLatest(startChatWithUserRequest.type, startChatWithUserSaga);
}
