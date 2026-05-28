//Redux Root File

import { configureStore, combineReducers } from "@reduxjs/toolkit";
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

const sagaMiddleware = createSagaMiddleware();

const appReducer = combineReducers({
  auth: authReducer,
  social: socialReducer,
  post: postReducer,
  custom: customReducer,
  measurement: measurementReducer,
  chat: chatReducer,
  cloth: clothReducer,
  admin: adminReducer,
  order: orderReducer
});

const rootReducer = (state, action) => {
  if (action.type === "auth/logout") {
    // Completely wipe Redux state on logout to prevent stale state leaks
    state = undefined;
  }
  return appReducer(state, action);
};

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware( {serializableCheck: false,} ).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);
