import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import authReducer from "./authSlice";
import socialReducer from "./socialSlice"
import rootSaga from "./rootSaga";
import postReducer from "./postSlice"
import customReducer from "./customSlice"
import  measurementReducer from "./measurementSlice"
import chatReducer from "./chatSlice"


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
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(sagaMiddleware),
});

// Run the root saga
sagaMiddleware.run(rootSaga);
