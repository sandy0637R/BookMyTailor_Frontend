// measurementSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  fetchMeasurementsRequest,
  fetchMeasurementsSuccess,
  fetchMeasurementsFailure,
  addMeasurementSuccess,
  addMeasurementFailure,
  deleteMeasurementSuccess,
  deleteMeasurementFailure,
  updateMeasurementSuccess,
  updateMeasurementFailure,
} from "./measurementSlice";
import { toast } from "react-hot-toast";

// GET
function* fetchMeasurementsSaga(action) {
  try {
    const res = yield call(axios.get, "http://localhost:5000/measurements/", {
      headers: { Authorization: `Bearer ${action.payload}` },
    });
    yield put(fetchMeasurementsSuccess(res.data || []));
  } catch (err) {
    yield put(fetchMeasurementsFailure(err.message));
    toast.error("Failed to fetch measurements");
  }
}

// POST
function* addMeasurementSaga(action) {
  try {
    yield call(axios.post, "http://localhost:5000/measurements/", action.payload.formData, {
      headers: { Authorization: `Bearer ${action.payload.token}` },
    });
    yield put(addMeasurementSuccess());
    toast.success("Measurement added!");
    yield put(fetchMeasurementsRequest(action.payload.token)); // Refresh list
  } catch (err) {
    yield put(addMeasurementFailure(err.response?.data?.message || err.message));
    toast.error(err.response?.data?.message || "Failed to add measurement");
  }
}

// DELETE
function* deleteMeasurementSaga(action) {
  try {
    yield call(axios.delete, `http://localhost:5000/measurements/${action.payload.id}`, {
      headers: { Authorization: `Bearer ${action.payload.token}` },
    });
    yield put(deleteMeasurementSuccess());
    toast.success("Measurement deleted!");
    yield put(fetchMeasurementsRequest(action.payload.token)); // Refresh list
  } catch (err) {
    yield put(deleteMeasurementFailure(err.message));
    toast.error("Failed to delete");
  }
}

// PUT
function* updateMeasurementSaga(action) {
  try {
    yield call(
      axios.put,
      `http://localhost:5000/measurements/${action.payload.id}`,
      action.payload.formData,
      {
        headers: { Authorization: `Bearer ${action.payload.token}` },
      }
    );
    yield put(updateMeasurementSuccess());
    toast.success("Measurement updated!");
    yield put(fetchMeasurementsRequest(action.payload.token)); // Refresh list
  } catch (err) {
    yield put(updateMeasurementFailure(err.message));
    toast.error("Failed to update");
  }
}

// Watchers
export function* watchMeasurement() {
  yield takeLatest("measurement/fetchMeasurementsRequest", fetchMeasurementsSaga);
  yield takeLatest("measurement/addMeasurementRequest", addMeasurementSaga);
  yield takeLatest("measurement/deleteMeasurementRequest", deleteMeasurementSaga);
  yield takeLatest("measurement/updateMeasurementRequest", updateMeasurementSaga);
}
