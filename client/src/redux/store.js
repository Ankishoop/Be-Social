import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import postReducer from "./postSlice.js";
import loginReducer from "./loginSlice.js";
import socketReducer from "./socketSlice.js";
import chatReducer from "./chatSlice.js";
import rtnReducer from "./rtnSlice.js";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  auth: authReducer,
  post: postReducer,
  login: loginReducer,
  socket: socketReducer,
  chat: chatReducer,
  rtn: rtnReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
