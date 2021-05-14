import React from "react";
import { Switch, Route, BrowserRouter as Router } from "react-router-dom";
// containers
import Drawer from "./containers/drawer";
import Main from "./containers/main";
import Courses from "./containers/courses";
import Login from "./containers/login";

const Routes = () => (
  <Switch>
    <Route exact from="/" render={(props) => <Main {...props} />} />
    <Route exact path="/courses" render={(props) => <Courses {...props} />} />
    <Route exact path="/login" render={(props) => <Login {...props} />} />
  </Switch>
);

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
