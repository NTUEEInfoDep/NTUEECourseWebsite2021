import React from "react";
import { useSelector } from "react-redux";
// slices
import { selectSession } from "../../slices/sessionSlice";

// TODO
export default function PrivateRoute({ children }) {
  const { isLogin } = useSelector(selectSession);
  return (
    <div>
      {isLogin ? children : "You are not login please go to login page"}
    </div>
  );
}
