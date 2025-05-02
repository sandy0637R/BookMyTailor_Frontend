import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  login,
  setProfile,
  setError,
  setLoading,
} from "./authSlice";

// LOGIN API
const loginApi = (loginInfo) => {
  return axios.post("http://localhost:5000/users/login", loginInfo);
};

// FETCH PROFILE API
const fetchProfileApi = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login first.");
  return axios.get("http://localhost:5000/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// UPDATE PROFILE API
const updateProfileApi = (profileData) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login first.");
  return axios.put("http://localhost:5000/users/profile", profileData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// LOGIN SAGA
function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload);
    const { success, message, token, name, email } = response.data;

    if (success) {
      yield put(login({ token, name, email }));
      localStorage.setItem("token", token);
      localStorage.setItem("loggedInUser", name);
      localStorage.setItem("email", email);
    } else {
      yield put(setError(message || "Login failed. Please try again."));
    }
  } catch (err) {
    yield put(setError(err.response?.data?.message || err.message || "Login failed"));
  }
}

// FETCH PROFILE SAGA
function* fetchUserProfile() {
  try {
    yield put(setLoading(true));
    const response = yield call(fetchProfileApi);
    yield put(setProfile(response.data)); // Full profile returned
    yield put(setLoading(false));
  } catch (err) {
    yield put(setError(err.message || "Error fetching profile."));
    yield put(setLoading(false));
  }
}

// UPDATE PROFILE SAGA
function* updateProfileSaga(action) {
  try {
    yield put(setLoading(true));
    const response = yield call(updateProfileApi, action.payload);
    yield put(setProfile(response.data.user)); // Ensure full updated profile is set
    yield put(setLoading(false));
  } catch (err) {
    yield put(setError(err.message || "Error updating profile."));
    yield put(setLoading(false));
  }
}

// WATCHERS
export function* watchLogin() {
  yield takeLatest("auth/loginRequest", loginSaga);
}

export function* watchFetchProfile() {
  yield takeLatest("auth/fetchProfileRequest", fetchUserProfile);
}

export function* watchUpdateProfile() {
  yield takeLatest("auth/updateProfileRequest", updateProfileSaga);
}
