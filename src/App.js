import React from "react";
import { useSelector } from "react-redux";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Courses from "./containers/courses";
import Login from "./containers/login";
import StudentData from "./containers/studentData";

// slices
import { selectSession } from "./slices/sessionSlice";

const Routes = () => {
  const { authority } = useSelector(selectSession);
  console.log(authority);
  return (
    <Switch>
      <Route exact from="/" render={(props) => <Main {...props} />} />
      <Route exact path="/courses" render={(props) => <Courses {...props} />} />
      <Route exact path="/login" render={(props) => <Login {...props} />} />
      <Route
        exact
        path="/studentdata"
        render={(props) => <StudentData {...props} />}
      />
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
