import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    all: [],
  },
  reducers: {
    setPosts: (state, action) => {
      state.all = action.payload;
    },
    addPost: (state, action) => {
      const exists = state.all.some((p) => p._id === action.payload._id);
      if (!exists) {
        state.all.unshift(action.payload);
      }
    },
    removePost: (state, action) => {
      state.all = state.all.filter((p) => p._id !== action.payload);
    },
    updatePostStatus: (state, action) => {
      const post = state.all.find((p) => p._id === action.payload.id);
      if (post) {
        post.status = action.payload.status;
      }
    },
    updatePostInStore: (state, action) => {
      const index = state.all.findIndex((p) => p._id === action.payload._id);
      if (index !== -1) {
        state.all[index] = { ...state.all[index], ...action.payload };
      }
    },
  },
});

export const {
  setPosts,
  addPost,
  removePost,
  updatePostStatus,
  updatePostInStore,
} = postsSlice.actions;
export default postsSlice.reducer;
