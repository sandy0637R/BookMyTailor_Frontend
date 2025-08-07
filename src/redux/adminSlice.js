import { createSlice } from "@reduxjs/toolkit";

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    stats: {
      totalUsers: 0,
      onlyCustomers: 0,
      tailors: 0,
      totalCloths: 0,
      totalPosts: 0,
    },
    users: [],
    cloths: [],
    orders: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchStatsRequest: (state) => {
      state.loading = true;
    },
    fetchStatsSuccess: (state, action) => {
      state.stats = { ...state.stats, ...action.payload };
      state.loading = false;
    },
    fetchStatsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchUsersRequest: (state) => {
      state.loading = true;
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchClothsRequest: (state) => {
      state.loading = true;
    },
    fetchClothsSuccess: (state, action) => {
      state.cloths = action.payload;
      state.stats.totalCloths = action.payload.length;
      state.loading = false;
    },
    fetchClothsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
fetchOrdersRequest: (state) => {
  state.loading = true;
},
fetchOrdersSuccess: (state, action) => {
  state.orders = action.payload;
  state.loading = false;
},
fetchOrdersFailure: (state, action) => {
  state.loading = false;
  state.error = action.payload;
},
updateOrderStatusRequest: () => {},

updateOrderStatusSuccess: (state, action) => {
  const updatedOrder = action.payload.order; // ✅ extract correct object

  state.orders = state.orders.map((order) =>
    order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
  );
},


updateOrderStatusFailure: (state, action) => {
  state.error = action.payload;
},

    blockUnblockUserRequest: () => {},
    deleteClothRequest: () => {},
    editClothRequest: () => {},
  },
});

export const {
  fetchStatsRequest,
  fetchStatsSuccess,
  fetchStatsFailure,
  fetchUsersRequest,
  fetchUsersSuccess,
  fetchUsersFailure,
  fetchClothsRequest,
  fetchClothsSuccess,
  fetchClothsFailure,
  blockUnblockUserRequest,
  deleteClothRequest,
  editClothRequest,
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  updateOrderStatusRequest,
updateOrderStatusSuccess,
updateOrderStatusFailure,

} = adminSlice.actions;

export default adminSlice.reducer;
