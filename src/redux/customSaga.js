// customSaga.js
import { call, put, takeLatest, select, all, delay } from "redux-saga/effects";
import axios from "axios";
import {
  setUploadedRequests,
  setAcceptedRequests,
  setRequestHistory,
  setDirectRequests,
  setTimers,
  setSelectedRequest,
} from "./customSlice";
import { toast } from "react-hot-toast";

const BASE_URL = "https://bookmytailor-backend.onrender.com";

function* fetchUploadedRequestsSaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/custom/requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setUploadedRequests(data));
  } catch {
    toast.error("Failed to load uploaded requests");
  }
}

function* fetchAcceptedRequestsSaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/custom/accepted-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setAcceptedRequests(data));
  } catch {
    toast.error("Failed to load accepted requests");
  }
}

function* fetchRequestHistorySaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/custom/request-history`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setRequestHistory(data));
  } catch {
    toast.error("Failed to load request history");
  }
}

function* fetchDirectRequestsSaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/custom/requests/direct`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setDirectRequests(data));
  } catch {
    toast.error("Failed to load direct requests");
  }
}

function* acceptRequestSaga(action) {
  const { requestId, customerId } = action.payload;
  try {
    const token = yield select((state) => state.auth.token);
    yield call(
      axios.put,
      `${BASE_URL}/custom/request/${customerId}/${requestId}/accept`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Request accepted");
    yield all([
      call(fetchUploadedRequestsSaga),
      call(fetchDirectRequestsSaga),
      call(fetchAcceptedRequestsSaga),
    ]);
  } catch {
    toast.error("Failed to accept request");
  }
}

function* updateStatusSaga(action) {
  const { requestId, customerId, newStatus } = action.payload;
  try {
    const token = yield select((state) => state.auth.token);
    yield call(
      axios.put,
      `${BASE_URL}/custom/request/${customerId}/${requestId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    toast.success("Status updated");

    const { data } = yield call(axios.get, `${BASE_URL}/custom/accepted-requests`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(setAcceptedRequests(data));

    const selected = yield select((state) => state.custom.selectedRequest);
    if (selected?._id === requestId) {
      const updated = data.find((r) => r._id === requestId);
      if (updated) {
        yield put(setSelectedRequest(updated));
      }
    }
  } catch {
    toast.error("Failed to update status");
  }
}

function* updateTimersSaga() {
  const acceptedRequests = yield select((state) => state.custom.acceptedRequests);
  const statusPhases = ["Accepted", "Ready", "Out for Delivery", "Delivered"];
  const ratios = [0.5, 0.25, 0.2, 0.05];
  const now = Date.now();

  const timers = {};

  for (const req of acceptedRequests) {
    const { acceptedAt, duration, status, _id } = req;
    if (!acceptedAt || !duration || status === "Delivered") continue;

    const start = new Date(acceptedAt).getTime();
    const end = new Date(duration).getTime();
    const total = end - start;
    const currentIdx = statusPhases.indexOf(status);
    if (currentIdx === -1) continue;

    let nextPhaseTime = start;
    for (let i = 0; i <= currentIdx; i++) {
      nextPhaseTime += total * ratios[i];
    }

    const timeLeft = nextPhaseTime - now;
    const format = (ms) => {
      const abs = Math.abs(ms);
      const h = String(Math.floor(abs / 3600000)).padStart(2, "0");
      const m = String(Math.floor((abs % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((abs % 60000) / 1000)).padStart(2, "0");
      return (ms < 0 ? "-" : "") + `${h}:${m}:${s}`;
    };

    const phaseStart = nextPhaseTime - total * ratios[currentIdx];
    const phaseTotal = nextPhaseTime - phaseStart;
    const phaseElapsed = now - phaseStart;
    const progress = Math.min(100, Math.floor((phaseElapsed / phaseTotal) * 100));

    let color = "text-green-500";
    if (timeLeft < 0) color = "text-red-900";
    else if (timeLeft <= phaseTotal * 0.1) color = "text-red-600";
    else if (timeLeft <= phaseTotal * 0.5) color = "text-yellow-500";

    timers[_id] = { timeLeft: format(timeLeft), progress, color };
  }

  yield put(setTimers(timers));
}

function* watchTimerUpdates() {
  while (true) {
    yield call(updateTimersSaga);
    yield delay(1000);
  }
}

export function* watchCustom() {
  yield all([
    takeLatest("FETCH_UPLOADED_REQUESTS", fetchUploadedRequestsSaga),
    takeLatest("FETCH_ACCEPTED_REQUESTS", fetchAcceptedRequestsSaga),
    takeLatest("FETCH_REQUEST_HISTORY", fetchRequestHistorySaga),
    takeLatest("FETCH_DIRECT_REQUESTS", fetchDirectRequestsSaga),
    takeLatest("ACCEPT_REQUEST", acceptRequestSaga),
    takeLatest("UPDATE_REQUEST_STATUS", updateStatusSaga),
    call(watchTimerUpdates),
  ]);
}