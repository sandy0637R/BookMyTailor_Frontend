import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import {
  fetchClothsRequest,
  fetchClothsSuccess,
  fetchClothsFailure,
  addClothRequest,
  addClothSuccess,
  addClothFailure,
  updateClothRequest,
  updateClothSuccess,
  updateClothFailure,
  deleteClothRequest,
  deleteClothSuccess,
  deleteClothFailure,
} from "./clothSlice";
import { toast } from "react-hot-toast";

const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://bookmytailor-backend.onrender.com";

function* fetchClothsSaga() {
  try {
    const token = localStorage.getItem("token");
    const res = yield call(axios.get, `${BASE_URL}/cloths/my-cloths`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(fetchClothsSuccess(res.data));
  } catch (error) {
    yield put(fetchClothsFailure(error.message));
    toast.error(error.response?.data?.message || "Failed to fetch cloths.");
  }
}

function* addClothSaga(action) {
  try {
    const token = localStorage.getItem("token");
    const form = new FormData();

    const data = action.payload;
    Object.entries(data).forEach(([key, val]) => {
      if (key === "size") val.forEach((s) => form.append("size", s));
      else if (val) form.append(key, val);
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    yield call(axios.post, `${BASE_URL}/cloths`, form, config);
    yield put(addClothSuccess());
    toast.success("Cloth added successfully!");
    yield put(fetchClothsRequest());
  } catch (error) {
    yield put(addClothFailure(error.message));
    toast.error(error.response?.data?.message || "Error submitting cloth.");
  }
}


function* updateClothSaga(action) {
  try {
    const token = localStorage.getItem("token");
    const { id, data } = action.payload;
    const form = new FormData();

    Object.entries(data).forEach(([key, val]) => {
      if (key === "size") val.forEach((s) => form.append("size", s));
      else if (val) form.append(key, val);
    });

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    yield call(axios.put, `${BASE_URL}/cloths/${id}`, form, config);
    yield put(updateClothSuccess());
    toast.success("Cloth updated successfully!");
    yield put(fetchClothsRequest());
  } catch (error) {
    yield put(updateClothFailure(error.message));
    toast.error(error.response?.data?.message || "Error updating cloth.");
  }
}

function* deleteClothSaga(action) {
  try {
    const token = localStorage.getItem("token");
    yield call(axios.delete, `${BASE_URL}/cloths/${action.payload}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(deleteClothSuccess());
    toast.success("Cloth deleted successfully!");
    yield put(fetchClothsRequest());
  } catch (error) {
    yield put(deleteClothFailure(error.message));
    toast.error(error.response?.data?.message || "Delete failed.");
  }
}

export function* watchCloth() {
  yield takeLatest(fetchClothsRequest.type, fetchClothsSaga);
  yield takeLatest(addClothRequest.type, addClothSaga);
  yield takeLatest(updateClothRequest.type, updateClothSaga);
  yield takeLatest(deleteClothRequest.type, deleteClothSaga);
}
