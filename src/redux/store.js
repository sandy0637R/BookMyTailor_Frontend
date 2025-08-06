import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./authSlice";
import socialReducer from "./socialSlice"
import rootSaga from "./rootSaga";
import postReducer from "./postSlice"
import customReducer from "./customSlice"
import  measurementReducer from "./measurementSlice"
import chatReducer from "./chatSlice"
import clothReducer from "./clothSlice"; 
import adminReducer from "./adminSlice";
import orderReducer from "./orderSlice"

// Create the saga middleware
const sagaMiddleware = createSagaMiddleware();

// Configure the store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    social: socialReducer,
    post: postReducer,
    custom:customReducer,
    measurement:measurementReducer,
    chat:chatReducer,
    cloth:clothReducer,
    admin:adminReducer,
    order:orderReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware( {serializableCheck: false,} ).concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);
