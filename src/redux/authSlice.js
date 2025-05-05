import { createSlice } from "@reduxjs/toolkit";

// Load each key individually
const savedAuth = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  user: localStorage.getItem("user") || null,
  email: localStorage.getItem("email") || null,
  roles: JSON.parse(localStorage.getItem("roles")) || ["customer"],
  tailorDetails: JSON.parse(localStorage.getItem("tailorDetails")) || null,
  profile: JSON.parse(localStorage.getItem("profile")) || null,
  token: localStorage.getItem("token") || null,
};

const initialState = {
  ...savedAuth,
  loading: false,
  error: null,
};

// Save each item individually
const saveToLocalStorage = (state) => {
  localStorage.setItem("isLoggedIn", JSON.stringify(state.isLoggedIn));
  localStorage.setItem("user", state.user || "");
  localStorage.setItem("email", state.email || "");
  localStorage.setItem("roles", JSON.stringify(state.roles || ["customer"]));
  localStorage.setItem("tailorDetails", JSON.stringify(state.tailorDetails));
  localStorage.setItem("profile", JSON.stringify(state.profile));
  localStorage.setItem("token", state.token || "");
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    login: (state, action) => {
      const { name, email, roles = ["customer"], tailorDetails = null, token } = action.payload;
      state.isLoggedIn = true;
      state.user = name;
      state.email = email;
      state.roles = roles.map((role) => role.toLowerCase());
      state.tailorDetails = tailorDetails;
      state.token = token;
      state.loading = false;
      state.error = null;
      saveToLocalStorage(state);
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
      });
      localStorage.clear();
    },
    fetchProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProfile: (state, action) => {
      const { name, email, roles = ["customer"], tailorDetails = null } = action.payload;
      state.profile = action.payload;
      state.user = name;
      state.email = email;
      state.roles = roles.map((role) => role.toLowerCase());
      state.tailorDetails = tailorDetails;
      state.loading = false;
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
    clearError: (state) => {
      state.error = null;
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
  setLoading,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;
