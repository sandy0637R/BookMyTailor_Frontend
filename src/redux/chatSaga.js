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
  setChatUser,
} from "./chatSlice";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

// 📩 Fetch conversation messages
function* fetchChatSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { userId1, userId2 } = action.payload;

    const { data } = yield call(
      axios.get,
      `${BASE_URL}/api/chat/conversation/${userId1}/${userId2}`,
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    yield put(fetchChatSuccess(data));
  } catch (error) {
    yield put(fetchChatFailure(error.message));
    toast.error("Failed to load chat messages");
  }
}

function* markMessagesReadSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const messageIds = action.payload;

    const { data } = yield call(
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
    yield put(fetchChatUsersFailure(error.message));
    toast.error("Failed to load chat users");
  }
}

// 📨 Send message saga
function* sendMessageSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { senderId, receiverId, message } = action.payload;

    yield call(
      axios.post,
      `${BASE_URL}/api/chat/send`,
      {
        sender: senderId,
        receiver: receiverId,
        message,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    yield put(sendMessageSuccess());
    yield put(fetchChatUsersRequest()); // ✅ Refresh chat users after message
  } catch (error) {
    yield put(sendMessageFailure(error.message));
    toast.error("Failed to send message");
  }
}

// 💬 Start chat saga using `startChatWithUserRequest`
function* startChatWithUserSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { senderId, receiverId } = action.payload;

    if (!senderId || !receiverId) {
      throw new Error("Invalid sender or receiver ID");
    }

    const { data } = yield call(
      axios.post,
      `${BASE_URL}/api/chat/start`,
      { sender: senderId.toString(), receiver: receiverId.toString() },
      {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      }
    );

    // 👇 Set chatUser manually for navigation
    yield put(startChatWithUserSuccess({ _id: receiverId }));
  } catch (error) {
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
  yield takeLatest(startChatWithUserRequest.type, startChatWithUserSaga); // ✅ Correct watcher
}
