import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  likeNotification: [],
};

const rtntSlice = createSlice({
  name: "realTimeNotification",
  initialState,
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likeNotification.push(action.payload);
      } else {
        state.likeNotification = state.likeNotification.filter(
          (item) => item.userId !== action.payload.userId
        );
      }
    },
    setLikeNotificationAfterView: (state, action) => {
      state.likeNotification = action.payload;
    },
  },
});

export const { setLikeNotification, setLikeNotificationAfterView } =
  rtntSlice.actions;

export default rtntSlice.reducer;
