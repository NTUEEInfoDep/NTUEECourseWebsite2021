import { createSlice } from "@reduxjs/toolkit";
import { SessionAPI } from "../api";

export const sessionSlice = createSlice({
  name: "session",
  initialState: {
    initialized: false,
    isLogin: false,
    authority: null,
    userID: null,
  },
  reducers: {
    //login
    setLogin: (state, action) => {
      state.isLogin = true;
      state.authority = action.payload.authority;
      state.userID = action.payload.userID;
    },
    setLogout: (state) => {
      state.isLogin = false;
      state.authority = null;
      state.userID = null;
    },
    //initialize
    setInitialized: (state) => {
      state.initialized = true;
    },
  },
});

//check whether isLogin is true(session.status=="200") first
export const init = () => async (dispatch) => {
  try {
    const session = await SessionAPI.getSession();
    if (session.status === 200) {
      dispatch(setLogin(session.data));
      dispatch(setInitialized());
    }
  } catch (err) {
    dispatch(setInitialized());
  }
};

export const logout = () => async (dispatch) => {
  const session = await SessionAPI.deleteSession();
  dispatch(setLogout());
};

export const { setLogin, setLogout, setInitialized } = sessionSlice.actions;

export const selectSession = (state) => state.session;

export default sessionSlice.reducer;
