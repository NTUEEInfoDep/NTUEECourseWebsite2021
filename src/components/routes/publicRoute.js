import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Loading from "../loading";
// slices
import { selectSession } from "../../slices/sessionSlice";

// TODO
export default function PublicRoute({ children, path }) {
  const { isLogin, initialized } = useSelector(selectSession);
  return (
    <Route
      exact
      path={path}
      render={() => {
        //if (!initialized) return <Loading />;
        return isLogin ? children : <Redirect to="/login" />;
      }}
    />
  );
}
