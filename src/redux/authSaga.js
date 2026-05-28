import { takeLatest, call, put } from "redux-saga/effects";
import axios from "axios";
import {
  login,
  setProfile,
  setError,
  setRoleError,
  setLoading,
  fetchProfileRequest,
  setRole,
  setCloths,
  setClothsError,
  setSingleCloth,        
  setSingleClothError,
  clearCart, 
  clearCartRequest,
  setWishlist,
  setCartAndWishlist,
} from "./authSlice";

// Utility to get token from localStorage
const BASE_URL =
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:5000/"
    : "https://bookmytailor-backend.onrender.com/";
const resolveImagePath = (path) =>
  path?.startsWith("http") ? path : BASE_URL + path;

const token = () => localStorage.getItem("token");
const authHeader = () => ({ Authorization: `Bearer ${token()}` });

// API calls
const loginApi = (loginInfo) =>
  axios.post("https://bookmytailor-backend.onrender.com/users/login", loginInfo);

const fetchProfileApi = () =>
  axios.get("https://bookmytailor-backend.onrender.com/users/profile", {
    headers: authHeader(),
  });

const updateProfileApi = (profileData) =>
  axios.put("https://bookmytailor-backend.onrender.com/users/profile", profileData, {
    headers: authHeader(),
  });

const getClothsApi = () =>
  axios.get("https://bookmytailor-backend.onrender.com/cloths/allcloths");

const getClothByIdApi = (id) =>                          // ✅ added
  axios.get(`https://bookmytailor-backend.onrender.com/cloths/${id}`);       // ✅ added

const addToWishlistApi = (itemId) =>
  axios.post("https://bookmytailor-backend.onrender.com/users/wishlist", { itemId }, { headers: authHeader() });

const removeFromWishlistApi = (itemId) =>
  axios.delete(`https://bookmytailor-backend.onrender.com/users/wishlist/${itemId}`, { headers: authHeader() });

const addToCartApi = (itemId) =>
  axios.post("https://bookmytailor-backend.onrender.com/users/cart", { itemId }, { headers: authHeader() });

const removeFromCartApi = (itemId) =>
  axios.delete(`https://bookmytailor-backend.onrender.com/users/cart/${itemId}`, { headers: authHeader() });

const clearCartApi = (userId) =>
  axios.delete(`https://bookmytailor-backend.onrender.com/users/cart/clear/${userId}`, {
    headers: authHeader(),
  });


// ✅ Cloths Saga
function* getClothsSaga() {
  try {
    const response = yield call(getClothsApi);
    const cloths = response.data;
    yield put(setCloths(cloths));
  } catch (error) {
    yield put(setClothsError(error.message));
  }
}

// ✅ Get Cloth by ID Saga
function* getClothByIdSaga(action) {
  try {
    const response = yield call(getClothByIdApi, action.payload);
    yield put(setSingleCloth(response.data));
  } catch (error) {
    yield put(setSingleClothError(error.message));
  }
}

function* addToWishlistSaga(action) {
  try {
    const response = yield call(addToWishlistApi, action.payload);
    yield put(setWishlist(response.data.wishlist));
  } catch (err) {
    yield put(setError(err.message));
  }
}

function* removeFromWishlistSaga(action) {
  try {
    const response = yield call(removeFromWishlistApi, action.payload);
    yield put(setWishlist(response.data.wishlist));
  } catch (err) {
    yield put(setError(err.message));
  }
}

function* addToCartSaga(action) {
  try {
    const response = yield call(addToCartApi, action.payload);
    // Note: The backend addToCart API automatically handles pulling from wishlist
    yield put(setCartAndWishlist({ 
      cart: response.data.cart, 
      wishlist: response.data.wishlist 
    }));
  } catch (err) {
    yield put(setError(err.message));
  }
}

function* removeFromCartSaga(action) {
  try {
    const response = yield call(removeFromCartApi, action.payload);
    yield put(setCartAndWishlist({ cart: response.data.cart }));
  } catch (err) {
    yield put(setError(err.message));
  }
}

function* clearCartSaga(action) {
  try {
    yield call(clearCartApi, action.payload); // payload is userId
    yield put(clearCart());                   // clear Redux state
  } catch (err) {
    yield put(setError(err.message));
  }
}





// Login Saga
function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload);
    const { success, token, name, email, roles, tailorDetails, profileImage, message } = response.data;

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

      yield put(setRole(action.payload.role));
      const fixedLoginImage = resolveImagePath(profileImage);
      yield put(login({ token, name, email, roles, tailorDetails, profileImage: fixedLoginImage }));

      localStorage.setItem("token", token || "");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("roles", JSON.stringify(roles || ["customer"]));
      localStorage.setItem("tailorDetails", JSON.stringify(tailorDetails || null));
      localStorage.setItem("profileImage", fixedLoginImage);
      yield put(fetchProfileRequest());
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
    const { _id, name, email, roles, tailorDetails, address, profileImage, wishlist, cart } = response.data;

    const fixedFetchedImage = resolveImagePath(profileImage);
    yield put(setProfile({
      _id, name, email, roles, tailorDetails, address,
      profileImage: fixedFetchedImage, wishlist, cart
    }));
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
  yield takeLatest("auth/getClothsRequest", getClothsSaga);
}

export function* watchGetClothById() {
  yield takeLatest("auth/getClothByIdRequest", getClothByIdSaga);  // ✅ added
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

export function* watchClearCart() {
  yield takeLatest("auth/clearCartRequest", clearCartSaga);
}

