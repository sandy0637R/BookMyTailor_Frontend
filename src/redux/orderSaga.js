// redux/orderSaga.js
import { call, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  placeOrderSuccess,
  placeOrderFailure,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  deleteOrderSuccess,
  deleteOrderFailure,
  fetchTopClothsSuccess,
  fetchTopClothsFailure,
} from "./orderSlice";
import { clearCartRequest } from "./authSlice";
import { toast } from "react-hot-toast";

// POST: Place Order
function* placeOrderSaga(action) {
  try {
    const { token, orderData, userId, navigate } = action.payload;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    yield call(
      axios.post,
      "http://localhost:5000/orders/place",
      orderData,
      config
    );

    yield put(placeOrderSuccess());
    yield put(clearCartRequest(userId));
    toast.success("Order placed successfully!");

    if (navigate) navigate("/orders");
  } catch (err) {
    yield put(placeOrderFailure(err.message));
    toast.error("Failed to place order.");
  }
}

// GET: Fetch My Orders
function* fetchOrdersSaga(action) {
  try {
    const { token } = action.payload;
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const res = yield call(
      axios.get,
      "http://localhost:5000/orders/my",
      config
    );

    yield put(fetchOrdersSuccess(res.data || []));
  } catch (err) {
    yield put(fetchOrdersFailure(err.message));
    toast.error("Failed to fetch orders.");
  }
}

function* deleteOrderSaga(action) {
  try {
    const { token, orderId } = action.payload;

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    yield call(
      axios.delete,
      `http://localhost:5000/orders/delete/${orderId}`,
      config
    );
    yield put(deleteOrderSuccess(orderId));
    toast.success("Order deleted successfully.");
  } catch (error) {
    yield put(
      deleteOrderFailure(error.response?.data?.message || error.message)
    );
    toast.error(error.response?.data?.message || "Failed to delete order.");
  }
}

function* fetchTopClothsSaga() {
  try {
    const res = yield call(
      axios.get,
      "http://localhost:5000/orders/top-cloths"
    );
    yield put(fetchTopClothsSuccess(res.data));
  } catch (error) {
    yield put(
      fetchTopClothsFailure(error.response?.data?.message || error.message)
    );
    toast.error(error.response?.data?.message || "Failed to fetch top cloths.");
  }
}

// Watchers
export function* watchOrder() {
  yield takeLatest("order/placeOrderRequest", placeOrderSaga);
  yield takeLatest("order/fetchOrdersRequest", fetchOrdersSaga);
  yield takeLatest("order/deleteOrderRequest", deleteOrderSaga);
  yield takeLatest("order/fetchTopClothsRequest", fetchTopClothsSaga);
}
