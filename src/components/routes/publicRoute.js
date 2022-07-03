import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
// slices
import { selectSession } from "../../slices/sessionSlice";

// TODO
export default function PublicRoute({ children, path }) {
  const { isLogin } = useSelector(selectSession);
  return (
    <Route
      exact
      path={path}
      render={() => {
        return isLogin ? children : <Redirect to="/login" />;
      }}
    />
  );
}
