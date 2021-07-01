import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Courses from "./containers/courses";
import Login from "./containers/login";
import StudentData from "./containers/studentData";
import CourseManage from "./containers/courseManage";
// slices
import { selectSession } from "./slices/sessionSlice";
//Route
import { Redirect } from "react-router";
import PublicRoute from "./components/routes/publicRoute";
import PrivateRoute from "./components/routes/privateRoute";

const Routes = () => {
  const { authority, isLogin } = useSelector(selectSession);
  console.log(authority);
  console.log(isLogin);
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
