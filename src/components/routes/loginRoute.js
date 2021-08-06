import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
// slices
import { selectSession } from "../../slices/sessionSlice";

export default function LoginRoute({ children, path }) {
  const { isLogin } = useSelector(selectSession);
  return (
    <Route
      path={path}
      render={() => {
        return isLogin ? <Redirect to="/" /> : children;
      }}
    />
  );
}
