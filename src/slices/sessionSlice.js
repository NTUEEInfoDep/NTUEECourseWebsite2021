import { createSlice } from "@reduxjs/toolkit";
import { SessionAPI } from "../api";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    isLogin: false,
    authority: null,
    userID: null,
  },
  reducers: {
    /**
     * Login
     */
    setLogin: (state, action) => {
      state.isLogin = true;
      state.authority = action.payload.authority;
      state.userID = action.payload.userID;
    },
  },
});

export const { setLogin } = sessionSlice.actions;

export const selectSession = (state) => state.session;

export default sessionSlice.reducer;
