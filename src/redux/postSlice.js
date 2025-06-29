import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  commentTexts: {},
  selectedCommentId: null,
  userId: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    updatePost: (state, action) => {
      const updatedPost = action.payload;
      state.posts = state.posts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      );
    },
    setCommentTexts: (state, action) => {
      state.commentTexts = { ...state.commentTexts, ...action.payload };
    },
    setSelectedCommentId: (state, action) => {
      state.selectedCommentId = action.payload;
    },
    setUserId: (state, action) => {
      state.userId = action.payload;
    },
  },
});

export const {
  setPosts,
  updatePost,
  setCommentTexts,
  setSelectedCommentId,
  setUserId,
} = postSlice.actions;

export default postSlice.reducer;