import React from "react";
import { useSelector } from "react-redux";
import { Route, Redirect } from "react-router-dom";
// slices
import { selectSession } from "../../slices/sessionSlice";

// TODO
export default function AdminRoute({ children, path }) {
  const { isLogin, authority } = useSelector(selectSession);
  return (
    <Route
      path={path}
      render={() => {
        if (!isLogin) return <Redirect to="/login" />;
        if (authority !== 2 && children.type.name !== "Selection")
          return <Redirect to="/" />;
        return children;
      }}
    />
  );
}
