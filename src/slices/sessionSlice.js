import { createSlice } from "@reduxjs/toolkit";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    isLogin: false,
  },
  reducers: {
    setLogin: (state, action) => {
      state.isLogin = true;
    },
  },
});

export const { setLogin } = sessionSlice.actions;

export const selectSession = (state) => state.session;

export default sessionSlice.reducer;
