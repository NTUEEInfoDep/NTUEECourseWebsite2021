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
      state.initialized = true;
      state.isLogin = true;
      state.authority = action.payload.authority;
      state.userID = action.payload.userID;
    },
    //initialize
    setInitializedLogin: (state, action) => {
      state.initialized = true;
      state.isLogin = true;
      state.authority = action.payload.authority;
      state.userID = action.payload.userID;
    },
    setInitializedNotLogin: (state, action) => {
      state.initialized = true;
      state.isLogin = false;
      state.authority = null;
      state.userID = null;
    },
  },
});

export const init = () => async (dispatch) => {
  try {
    const session = await SessionAPI.getSession();
    if (session.status == "200") {
      dispatch(setInitializedLogin(session.data));
    }
  } catch (err) {
    dispatch(setInitializedNotLogin());
  }
};

export const { setLogin, setInitializedLogin, setInitializedNotLogin } =
  sessionSlice.actions;

export const selectSession = (state) => state.session;

export default sessionSlice.reducer;
