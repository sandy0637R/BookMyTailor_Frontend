import { createSlice } from "@reduxjs/toolkit";

// Load profile safely
const savedProfile = JSON.parse(localStorage.getItem("profile")) || null;
const savedAuth = {
  isLoggedIn: JSON.parse(localStorage.getItem("isLoggedIn")) || false,
  roles: JSON.parse(localStorage.getItem("roles")) || ["customer"],
  tailorDetails: JSON.parse(localStorage.getItem("tailorDetails")) || null,
  profile: savedProfile,
  userId: savedProfile?._id || "",
  token: localStorage.getItem("token") || null,
  role: localStorage.getItem("role") || "customer",
  profileImage: localStorage.getItem("profileImage") || null,
  wishlist: JSON.parse(localStorage.getItem("wishlist")) || [],
  cart: JSON.parse(localStorage.getItem("cart")) || [],
};

const initialState = {
  ...savedAuth,
  loading: false,
  error: null,
  cloths: [],
  singleCloth: null,
};

const saveToLocalStorage = (state) => {
 

  localStorage.setItem("isLoggedIn", JSON.stringify(state.isLoggedIn));
  localStorage.setItem("user", state.user || "");
  localStorage.setItem("email", state.email || "");
  localStorage.setItem("roles", JSON.stringify(state.roles || ["customer"]));
  localStorage.setItem("tailorDetails", JSON.stringify(state.tailorDetails));
  localStorage.setItem("profile", JSON.stringify(state.profile));
  localStorage.setItem("userId", state.profile?._id || "");
  localStorage.setItem("token", state.token || "");
  localStorage.setItem("role", state.role || "customer");
  localStorage.setItem("profileImage", state.profileImage || "");
  localStorage.setItem("wishlist", JSON.stringify(state.wishlist || []));
  localStorage.setItem("cart", JSON.stringify(state.cart || []));
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
        _id,
        name,
        email,
        roles = ["customer"],
        tailorDetails = null,
        token,
        profileImage = null,
        wishlist = [],
        cart = [],
      } = action.payload;

      state.isLoggedIn = true;
      state.user = name;
      state.email = email;
      state.roles = roles.map((role) => role.toLowerCase());
      state.tailorDetails = tailorDetails;
      state.token = token;
      state.profileImage = profileImage;
      state.wishlist = wishlist;
      state.cart = cart.map((entry) => ({
        item: entry.item,
        quantity: entry.quantity,
      }));

      state.profile = {
        _id,
        name,
        email,
        roles,
        tailorDetails,
        profileImage,
      };

      state.loading = false;
      state.roleError = null;
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
        role: "customer",
        profileImage: null,
      });
      localStorage.clear();
    },
    fetchProfileRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    setProfile: (state, action) => {
      const {
        _id,
        name,
        email,
        roles = ["customer"],
        tailorDetails = null,
        profileImage = null,
        wishlist = [],
        cart = [],
      } = action.payload;

      state.profile = {
        _id,
        name,
        email,
        roles,
        tailorDetails,
        profileImage,
      };

      state.user = name;
      state.email = email;
      state.roles = roles.map((role) => role.toLowerCase());
      state.tailorDetails = tailorDetails;
      state.profileImage = profileImage;
      state.wishlist = wishlist;
      state.cart = cart.map((entry) => ({
        item: entry.item,
        quantity: entry.quantity,
      }));

      state.loading = false;
      state.role = localStorage.getItem("role") || "customer";

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
    getClothByIdRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.singleCloth = null;
    },
    setSingleCloth: (state, action) => {
      state.singleCloth = action.payload;
      state.loading = false;
    },
    setSingleClothError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
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
    addToWishlist: (state, action) => {},
    removeFromWishlist: (state, action) => {},
    addToCart: (state, action) => {},
    removeFromCart: (state, action) => {},
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
  getClothByIdRequest,
  setSingleCloth,
  setSingleClothError,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
} = authSlice.actions;

export default authSlice.reducer;
