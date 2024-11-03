import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  suggestedUsers: [],
  selectedUser: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
    },
    setSuggestedUsers: (state, action) => {
      state.suggestedUsers = action.payload;
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
});

export const { setAuthUser, setSuggestedUsers, setSelectedUser } =
  authSlice.actions;

export default authSlice.reducer;
