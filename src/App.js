import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Courses from "./containers/courses";
import Login from "./containers/login";
import StudentData from "./containers/studentData";
import CourseManage from "./containers/courseManage";
//Route
import { Redirect } from "react-router";
import PublicRoute from "./components/routes/publicRoute";
import PrivateRoute from "./components/routes/privateRoute";
//initialize
import { init } from "./slices/sessionSlice";

const Routes = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(init());
  }, []);
  return (
    <Switch>
      <PublicRoute exact path="/">
        <Main />
      </PublicRoute>
      <PublicRoute exact path="/courses">
        <Courses />
      </PublicRoute>
      <Route exact path="/login" render={() => <Login />} />
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
      <Router>
        <Drawer>
          <Routes />
        </Drawer>
      </Router>
    </div>
  );
}
