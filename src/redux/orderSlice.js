// redux/orderSlice.js
import { createSlice } from "@reduxjs/toolkit";

const orderSlice = createSlice({
  name: "order",
  initialState: {
    loading: false,
    error: null,
    orders: [],
  },
  reducers: {
    placeOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    placeOrderSuccess: (state) => {
      state.loading = false;
    },
    placeOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    fetchOrdersRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchOrdersSuccess: (state, action) => {
      state.loading = false;
      state.orders = action.payload;
    },
    fetchOrdersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteOrderRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    deleteOrderSuccess: (state, action) => {
      state.loading = false;
      state.orders = state.orders.filter(order => order._id !== action.payload);
    },
    deleteOrderFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  placeOrderRequest,
  placeOrderSuccess,
  placeOrderFailure,
  fetchOrdersRequest,
  fetchOrdersSuccess,
  fetchOrdersFailure,
  deleteOrderRequest,
  deleteOrderSuccess,
  deleteOrderFailure,
} = orderSlice.actions;

export default orderSlice.reducer;
