import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import postsReducer from "./postsSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
  },
});
