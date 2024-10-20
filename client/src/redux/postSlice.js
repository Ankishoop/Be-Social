import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  posts: [],
  loading: false,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
      state.loading = false;
    },

    setLoading: (state, action) => {
      state.loading = true;
    },
    addPost: (state, action) => {
      state.posts = [action.payload, ...state.posts];
      state.loading = false;
    },
  },
});

export const { setPosts, setLoading, addPost } = postSlice.actions;

export default postSlice.reducer;
