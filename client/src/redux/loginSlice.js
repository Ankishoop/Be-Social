import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoginUser: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
});

export const { setLoginUser } = loginSlice.actions;

export default loginSlice.reducer;
