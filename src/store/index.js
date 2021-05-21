import { configureStore } from "@reduxjs/toolkit";
import sessionReducer from "../slices/sessionSlice";

export default configureStore({
  reducer: {
    session: sessionReducer,
  },
});
