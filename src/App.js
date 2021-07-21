import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "@material-ui/core/styles";
// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Courses from "./containers/courses";
import Selection from "./containers/selection";
import Login from "./containers/login";
import StudentData from "./containers/studentData";
import CourseManage from "./containers/courseManage";
import theme from "./theme";
// Route
import PublicRoute from "./components/routes/publicRoute";
import PrivateRoute from "./components/routes/privateRoute";
import LoginRoute from "./components/routes/loginRoute";
//initialize
import { init } from "./slices/sessionSlice";
//slices
import { selectSession } from "./slices/sessionSlice";
import Loading from "./components/loading";

const Routes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, []);
  const { initialized } = useSelector(selectSession);
  return !initialized ? (
    <Loading />
  ) : (
    <Switch>
      <PublicRoute exact path="/">
        <Main />
      </PublicRoute>
      <PublicRoute exact path="/courses">
        <Courses />
      </PublicRoute>
      <PrivateRoute exact path="/selection/:courseId">
        <Selection />
      </PrivateRoute>
      <LoginRoute exact path="/login">
        <Login />
      </LoginRoute>
      <PrivateRoute exact path="/studentdata">
        <StudentData />
      </PrivateRoute>
      <PrivateRoute exact path="/course-manage">
        <CourseManage />
      </PrivateRoute>
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
