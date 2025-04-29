import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import { login, setProfile, setError, setLoading } from "./authSlice";

// API call to handle login
const loginApi = (loginInfo) => {
  return axios.post("http://localhost:5000/users/login", loginInfo);
};

// API call to fetch user profile
const fetchProfileApi = () => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No token found. Please login first.");
  }
  return axios.get("http://localhost:5000/users/profile", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
};

// Saga to watch login action
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
    if (err.response && err.response.data && err.response.data.message) {
      // Server responded with a custom error message (like "Email not found")
      yield put(setError(err.response.data.message));
    } else {
      // Other errors (network error, etc.)
      yield put(setError(err.message || "Something went wrong. Try again."));
    }
  }
}


// Saga to fetch user profile
function* fetchUserProfile() {
  try {
    yield put(setLoading(true)); // Show loading spinner or indication
    const response = yield call(fetchProfileApi);
    console.log('Profile response:', response.data); // Check the structure of the response
    yield put(setProfile(response.data)); // Set the profile in the state
    yield put(setLoading(false)); // Hide loading spinner
  } catch (err) {
    console.log("Fetch Profile Error:", err);
    // Provide feedback to the user in case of error
    yield put(setError(err.message || "An error occurred while fetching the profile."));
    yield put(setLoading(false)); // Hide loading spinner
  }
}

// Watch for login action
export function* watchLogin() {
  yield takeLatest("auth/loginRequest", loginSaga);
}

// Watch for profile fetch action
export function* watchFetchProfile() {
  yield takeLatest("auth/fetchProfileRequest", fetchUserProfile);
}
