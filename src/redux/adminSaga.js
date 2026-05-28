import { call, put, takeLatest, select } from "redux-saga/effects";
import axios from "axios";
import {
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchClothsRequest,
  fetchClothsSuccess,
  fetchClothsFailure,
  blockUnblockUserRequest,
  deleteClothRequest,
  editClothRequest,
   fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderStatusRequest,
updateOrderStatusSuccess,
updateOrderStatusFailure,
} from "./adminSlice";
import { toast } from "react-hot-toast";

const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000"
    : "https://bookmytailor-backend.onrender.com";

function* fetchStatsSaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/admin/user-stats`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(fetchStatsSuccess(data));
  } catch (error) {
    yield put(fetchStatsFailure(error.message));
  }
}

function* fetchUsersSaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/admin/all`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(fetchUsersSuccess(data));
  } catch (error) {
    yield put(fetchUsersFailure(error.message));
  }
}

function* fetchClothsSaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/admin/cloths/allcloths`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(fetchClothsSuccess(data));
  } catch (error) {
    yield put(fetchClothsFailure(error.message));
  }
}

function* blockUnblockUserSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { id, isBlocked } = action.payload;

    const url = isBlocked
      ? `${BASE_URL}/admin/unblock-user/${id}`
      : `${BASE_URL}/admin/block-user/${id}`;

    yield call(axios.put, url, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success(isBlocked ? "User unblocked" : "User blocked");
    yield put(fetchUsersRequest());
  } catch (error) {
    toast.error("Action failed");
  }
}

function* deleteClothSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { clothId } = action.payload;

    yield call(axios.delete, `${BASE_URL}/admin/cloths/${clothId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Cloth deleted");
    yield put(fetchClothsRequest());
  } catch (error) {
    toast.error("Failed to delete cloth");
  }
}

function* editClothSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { clothId, name, price } = action.payload;

    yield call(
      axios.put,
      `${BASE_URL}/admin/cloths/${clothId}`,
      { name, price },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    toast.success("Cloth updated");
    yield put(fetchClothsRequest());
  } catch (error) {
    toast.error("Update failed");
  }
}

function* fetchOrdersSaga() {
  try {
    const token = yield select((state) => state.auth.token);
    const { data } = yield call(axios.get, `${BASE_URL}/admin/all-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    yield put(fetchOrdersSuccess(data));
  } catch (error) {
    yield put(fetchOrdersFailure(error.message));
  }
}

function* updateOrderStatusSaga(action) {
  try {
    const token = yield select((state) => state.auth.token);
    const { orderId, status } = action.payload;

    const { data } = yield call(
      axios.put,
      `${BASE_URL}/admin/orders/${orderId}/status`,
      { deliveryStatus: status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    toast.success("Order status updated");
    yield put({ type: updateOrderStatusSuccess.type, payload: data });
  } catch (error) {
    toast.error("Failed to update order status");
    yield put({ type: updateOrderStatusFailure.type, payload: error.message });
  }
}



export function* watchAdmin() {
  yield takeLatest(fetchStatsRequest.type, fetchStatsSaga);
  yield takeLatest(fetchUsersRequest.type, fetchUsersSaga);
  yield takeLatest(fetchClothsRequest.type, fetchClothsSaga);
  yield takeLatest(blockUnblockUserRequest.type, blockUnblockUserSaga);
  yield takeLatest(deleteClothRequest.type, deleteClothSaga);
  yield takeLatest(editClothRequest.type, editClothSaga);
  yield takeLatest(fetchOrdersRequest.type, fetchOrdersSaga);
  yield takeLatest(updateOrderStatusRequest.type, updateOrderStatusSaga);

}
