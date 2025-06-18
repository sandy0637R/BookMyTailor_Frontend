import { createSlice } from "@reduxjs/toolkit";

// Load each key individually
const savedAuth = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  roles: JSON.parse(localStorage.getItem("roles")) || ["customer"],
  tailorDetails: JSON.parse(localStorage.getItem("tailorDetails")) || null,
  profile: JSON.parse(localStorage.getItem("profile")) || null,
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || "customer", // ✅ added
  profileImage: localStorage.getItem("profileImage") || null, // ✅ added
};

const initialState = {
  ...savedAuth,
  loading: false,
  error: null,
  cloths: [], // ✅ added
  wishlist: [], // ✅ added
  cart: [],
};

const saveToLocalStorage = (state) => {
  localStorage.setItem("isLoggedIn", JSON.stringify(state.isLoggedIn));
  localStorage.setItem("user", state.user || "");
  localStorage.setItem("email", state.email || "");
  localStorage.setItem("roles", JSON.stringify(state.roles || ["customer"]));
  localStorage.setItem("tailorDetails", JSON.stringify(state.tailorDetails));
  localStorage.setItem("profile", JSON.stringify(state.profile));
  localStorage.setItem("token", state.token || "");
  localStorage.setItem("role", state.role || "customer");
  localStorage.setItem("profileImage", state.profileImage || ""); // ✅ added
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.roleError = null;
    },
    login: (state, action) => {
      const {
        name,
        email,
        roles = ["customer"],
        tailorDetails = null,
        token,
        profileImage = null, // ✅ added destructuring
      } = action.payload;
      state.isLoggedIn = true;
      state.user = name;
      state.email = email;
      state.roles = roles.map((role) => role.toLowerCase());
      state.tailorDetails = tailorDetails;
      state.token = token;
      state.profileImage = profileImage; // ✅ fixed assignment

      // ✅ I changed this: set profile object on login for localStorage consistency
      state.profile = { name, email, roles, tailorDetails, profileImage };

      state.loading = false;
      state.roleError = null;
      state.error = null;

      saveToLocalStorage(state);
    },
    getClothsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setCloths: (state, action) => {
      state.cloths = action.payload;
      state.loading = false;
    },
    setClothsError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    // ✅ Wishlist
    addToWishlist: (state, action) => {
      const item = action.payload;
      const exists = state.wishlist.find((i) => i._id === item._id);
      if (!exists) state.wishlist.push(item);
    },
    removeFromWishlist: (state, action) => {
      state.wishlist = state.wishlist.filter(
        (item) => item._id !== action.payload
      );
    },

    // ✅ Cart
    addToCart: (state, action) => {
      const item = action.payload;
      const exists = state.cart.find((i) => i._id === item._id);
      if (!exists) state.cart.push(item);
    },
    removeFromCart: (state, action) => {
      state.cart = state.cart.filter((item) => item._id !== action.payload);
    },

    logout: (state) => {
      Object.assign(state, initialState, {
        isLoggedIn: false,
        user: null,
        email: null,
        roles: ["customer"],
        tailorDetails: null,
        token: null,
        profile: null,
        role: "customer", // ✅ added
        profileImage: null, // ✅ added to reset on logout
      });
      localStorage.clear();
    },
    fetchProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProfile: (state, action) => {
      const {
        name,
        email,
        roles = ["customer"],
        tailorDetails = null,
        profileImage = null, // ✅ added destructuring
      } = action.payload;
      state.profile = action.payload;
      state.user = name;
      state.email = email;
      state.roles = roles.map((role) => role.toLowerCase());
      state.tailorDetails = tailorDetails;
      state.profileImage = profileImage; // ✅ set profileImage here
      state.loading = false;
      const currentRole = localStorage.getItem("role") || "customer";
      state.role = currentRole;

      saveToLocalStorage(state);
    },
    updateProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    updateRole: (state, action) => {
      const { roles = ["customer"], tailorDetails = null } = action.payload;
      state.roles = roles.map((role) => role.toLowerCase());
      state.tailorDetails = tailorDetails;
      state.loading = false;
      state.error = null;
      saveToLocalStorage(state);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setRoleError: (state, action) => {
      state.roleError = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setRole: (state, action) => {
      state.role = action.payload;
      localStorage.setItem("role", action.payload);
    },
  },
});

export const {
  loginRequest,
  login,
  logout,
  fetchProfileRequest,
  setProfile,
  updateProfileRequest,
  updateRole,
  setError,
  setRoleError,
  setLoading,
  clearError,
  setRole,
  getClothsRequest,
  setCloths,
  setClothsError,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
} = authSlice.actions;

export default authSlice.reducer;
