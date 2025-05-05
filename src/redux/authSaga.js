import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  login,
  setProfile,
  setError,
  setLoading,
  fetchProfileRequest,
} from "./authSlice";

// Utility to get token from localStorage
const token = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

// API calls
const loginApi = (loginInfo) =>
  axios.post("http://localhost:5000/users/login", loginInfo);

const fetchProfileApi = () =>
  axios.get("http://localhost:5000/users/profile", {
    headers: authHeader(),
  });

const updateProfileApi = (profileData) =>
  axios.put("http://localhost:5000/users/profile", profileData, {
    headers: authHeader(),
  });

// Login Saga
function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload);
    const { success, token, name, email, roles, tailorDetails, message } = response.data;

    if (success) {
      // Save to Redux
      yield put(login({ token, name, email, roles, tailorDetails }));

      // Save to localStorage separately
      localStorage.setItem("token", token || "");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", name || "");
      localStorage.setItem("email", email || "");
      localStorage.setItem("roles", JSON.stringify(roles || ["customer"]));
      localStorage.setItem("tailorDetails", JSON.stringify(tailorDetails || null));
    } else {
      yield put(setError(message));
    }
  } catch (err) {
    yield put(setError(err.response?.data?.message || err.message));
  }
}

// Fetch Profile Saga
function* fetchUserProfile() {
  try {
    yield put(setLoading(true));
    const response = yield call(fetchProfileApi);
    const { name, email, roles, tailorDetails } = response.data;

    yield put(setProfile({ name, email, roles, tailorDetails }));

    // Save profile and other data to localStorage
    localStorage.setItem("user", name || "");
    localStorage.setItem("email", email || "");
    localStorage.setItem("roles", JSON.stringify(roles || ["customer"]));
    localStorage.setItem("tailorDetails", JSON.stringify(tailorDetails || null));
    localStorage.setItem("profile", JSON.stringify(response.data));
  } catch (err) {
    yield put(setError(err.response?.data?.message || err.message));
  } finally {
    yield put(setLoading(false));
  }
}

// Update Profile Saga
function* updateProfileSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(updateProfileApi, action.payload);
    const { success, message } = response.data;

    if (success) {
      yield put(fetchProfileRequest());
    } else {
      yield put(setError(message));
    }
  } catch (err) {
    yield put(setError(err.response?.data?.message || err.message));
  } finally {
    yield put(setLoading(false));
  }
}

// Watchers
export function* watchLogin() {
  yield takeLatest("auth/loginRequest", loginSaga);
}

export function* watchFetchProfile() {
  yield takeLatest("auth/fetchProfileRequest", fetchUserProfile);
}

export function* watchUpdateProfile() {
  yield takeLatest("auth/updateProfileRequest", updateProfileSaga);
}
