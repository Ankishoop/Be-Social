import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  onLineUsers: [],
  messages: [],
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setOnlineUsers: (state, action) => {
      state.onLineUsers = action.payload;
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
  },
});

export const { setOnlineUsers, setMessages } = chatSlice.actions;

export default chatSlice.reducer;
