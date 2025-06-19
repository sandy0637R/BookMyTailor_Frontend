import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  login,
  setProfile,
  setError,
  setRoleError,
  setLoading,
  fetchProfileRequest,
  setRole, // ✅ added
    setCloths,             // ✅ added
  setClothsError 
  
} from "./authSlice";

// Utility to get token from localStorage
const BASE_URL = "http://localhost:5000/";
const resolveImagePath = (path) =>
  path?.startsWith("http") ? path : BASE_URL + path;

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
  const getClothsApi = () =>
  axios.get("http://localhost:5000/cloths/allcloths"); // ✅ added

 // Wishlist and Cart API with corrected structure
const addToWishlistApi = (itemId) =>
  axios.post("http://localhost:5000/users/wishlist", { itemId }, { headers: authHeader() });

const removeFromWishlistApi = (itemId) =>
  axios.delete(`http://localhost:5000/users/wishlist/${itemId}`, { headers: authHeader() });

const addToCartApi = (itemId) =>
  axios.post("http://localhost:5000/users/cart", { itemId }, { headers: authHeader() });

const removeFromCartApi = (itemId) =>
  axios.delete(`http://localhost:5000/users/cart/${itemId}`, { headers: authHeader() });



// ✅ Cloths Saga
function* getClothsSaga() {
  try {
    const response = yield call(getClothsApi);
    const cloths = response.data;

    yield put(setCloths(cloths)); // ✅ save cloths to state
  } catch (error) {
    yield put(setClothsError(error.message)); // ✅ handle error
  }
}

function* addToWishlistSaga(action) {
  try {
    yield call(addToWishlistApi, action.payload);
    yield put(fetchProfileRequest());
  } catch (err) {
    yield put(setError(err.message));
  }
}

function* removeFromWishlistSaga(action) {
  try {
    yield call(removeFromWishlistApi, action.payload);
    yield put(fetchProfileRequest());
  } catch (err) {
    yield put(setError(err.message));
  }
}

function* addToCartSaga(action) {
  try {
    yield call(addToCartApi, action.payload);              // ✅ Add to cart
    yield call(removeFromWishlistApi, action.payload);     // ✅ Remove from wishlist
    yield put(fetchProfileRequest());                      // ✅ Sync profile
  } catch (err) {
    yield put(setError(err.message));
  }
}


function* removeFromCartSaga(action) {
  try {
    yield call(removeFromCartApi, action.payload);
    yield put(fetchProfileRequest());
  } catch (err) {
    yield put(setError(err.message));
  }
}


// Login Saga
function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload);
    const { success, token, name, email, roles, tailorDetails,profileImage, message ,} = response.data;

    if (success) {
      if (
        action.payload.role === "admin" &&
        (!Array.isArray(roles) || !roles.includes("admin") || roles.length > 1)
      ) {
        yield put(setRoleError("You are not a valid admin."));
        return;
      }

      if (
        action.payload.role !== "admin" &&
        Array.isArray(roles) &&
        roles.length === 1 &&
        roles.includes("admin")
      ) {
        yield put(setRoleError("Admin must login with 'Login as Admin' selected."));
        return;
      }

      yield put(setRole(action.payload.role)); // ✅ set selected role globally
      const fixedLoginImage = resolveImagePath(profileImage);
     yield put(login({ token, name, email, roles, tailorDetails ,profileImage: fixedLoginImage }));


      localStorage.setItem("token", token || "");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("roles", JSON.stringify(roles || ["customer"]));
      localStorage.setItem("tailorDetails", JSON.stringify(tailorDetails || null));
localStorage.setItem("profileImage", fixedLoginImage);


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
    const { name, email, roles, tailorDetails, address, profileImage,wishlist, cart } = response.data;  // Add profileImage here

    const fixedFetchedImage = resolveImagePath(profileImage);
    yield put(setProfile({ name, email, roles, tailorDetails, address, profileImage: fixedFetchedImage , wishlist, cart }));
  // Include profileImage in state
    yield put(setRole(localStorage.getItem("role") || "customer"));

    localStorage.setItem("user", name || "");
    localStorage.setItem("email", email || "");
    localStorage.setItem("roles", JSON.stringify(roles || ["customer"]));
    localStorage.setItem("tailorDetails", JSON.stringify(tailorDetails || null));
    localStorage.setItem("address", JSON.stringify(address || {}));
    localStorage.setItem("profile", JSON.stringify(response.data));
localStorage.setItem("profileImage", fixedFetchedImage);
localStorage.setItem("wishlist", JSON.stringify(wishlist || []));
localStorage.setItem("cart", JSON.stringify(cart || []));

  // Save profileImage locally too
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

export function* watchGetCloths() {
  yield takeLatest("auth/getClothsRequest", getClothsSaga); // ✅ added
}

export function* watchAddToWishlist() {
  yield takeLatest("auth/addToWishlist", addToWishlistSaga);
}

export function* watchRemoveFromWishlist() {
  yield takeLatest("auth/removeFromWishlist", removeFromWishlistSaga);
}

export function* watchAddToCart() {
  yield takeLatest("auth/addToCart", addToCartSaga);
}

export function* watchRemoveFromCart() {
  yield takeLatest("auth/removeFromCart", removeFromCartSaga);
}
