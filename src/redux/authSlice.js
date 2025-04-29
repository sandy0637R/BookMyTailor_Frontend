import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: !!localStorage.getItem("token"),
  user: localStorage.getItem("loggedInUser") || null,
  email: localStorage.getItem("email") || null,
  profile: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    login: (state, action) => {
      state.isLoggedIn = true;
      state.user = action.payload.name;
      state.email = action.payload.email;
      state.loading = false;
      state.error = null;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.email = null;
      state.profile = null;
      state.loading = false;
      state.error = null;
      localStorage.clear();
    },
    fetchProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      state.loading = false;
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
    }
  }
});

export const {
  loginRequest,
  login,
  logout,
  fetchProfileRequest,
  setProfile,
  setError,
  setLoading,
  clearError
} = authSlice.actions;

export default authSlice.reducer;
