import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Courses from "./containers/courses";
import Login from "./containers/login";
import StudentData from "./containers/studentData";
import CourseManage from "./containers/courseManage";
import theme from "./theme";
// Route
import { Redirect } from "react-router";
import PublicRoute from "./components/routes/publicRoute";
import PrivateRoute from "./components/routes/privateRoute";
//initialize
import { init } from "./slices/sessionSlice";
//slices
import { selectSession } from "./slices/sessionSlice";

const Routes = () => {
  const dispatch = useDispatch();
  const { initialized, isLogin } = useSelector(selectSession);
  useEffect(() => {
    dispatch(init());
  }, []);
  console.log("initialized:", initialized);
  console.log("isLogin:", isLogin);
  return (
    <Switch>
      <PublicRoute exact path="/">
        <Main />
      </PublicRoute>
      <PublicRoute exact path="/courses">
        <Courses />
      </PublicRoute>
      <PublicRoute exact path="/login">
        <Login />
      </PublicRoute>
      <PrivateRoute exact path="/studentdata">
        <StudentData />
      </PrivateRoute>
      <PrivateRoute exact path="/course-manage">
        <CourseManage />
      </PrivateRoute>
      <Redirect to="/login" />
    </Switch>
  );
};

export default function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Router>
          <Drawer>
            <Routes />
          </Drawer>
        </Router>
      </ThemeProvider>
    </div>
  );
}
