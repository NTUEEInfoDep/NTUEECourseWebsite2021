import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Loading from "../loading";
// slices
import { selectSession } from "../../slices/sessionSlice";

// TODO
export default function PrivateRoute({ children, path }) {
  const { isLogin, authority, initialized } = useSelector(selectSession);
  return (
    <Route
      path={path}
      render={() => {
        //if (!initialized) return <Loading />;
        if (authority == 2) return <Redirect to="/" />;
        return isLogin ? children : <Redirect to="/login" />;
      }}
    />
  );
}
