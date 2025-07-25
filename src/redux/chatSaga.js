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
} from "./chatSlice";
import { toast } from "react-hot-toast";

const BASE_URL = "http://localhost:5000";

// 📩 Fetch conversation messages
function* fetchChatSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { userId1, userId2 } = action.payload;

    const { data } = yield call(axios.get, `${BASE_URL}/api/chat/conversation/${userId1}/${userId2}`, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    yield put(fetchChatSuccess(data));
  } catch (error) {
    yield put(fetchChatFailure(error.message));
    toast.error("Failed to load chat messages");
  }
}

// ✅ Mark messages as read
function* markMessagesReadSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const messageIds = action.payload;

    yield call(axios.put, `${BASE_URL}/api/chat/mark-read`, { messageIds }, {
      headers: { Authorization: `Bearer ${token}` },
      withCredentials: true,
    });

    yield put(markMessagesReadSuccess());
  } catch (error) {
    yield put(markMessagesReadFailure(error.message));
    toast.error("Failed to mark messages as read");
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

// 👀 Watcher saga
export function* watchChat() {
  yield takeLatest(fetchChatRequest.type, fetchChatSaga);
  yield takeLatest("chat/markMessagesReadRequest", markMessagesReadSaga);
  yield takeLatest(fetchChatUsersRequest.type, fetchChatUsersSaga);
}
