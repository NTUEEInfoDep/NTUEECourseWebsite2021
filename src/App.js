import React from "react";
// react router
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
// containers
import Main from "./containers/main";
import Courses from "./containers/courses";
import Login from "./containers/login";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div>
          <nav>
            <ul>
              <li>
                <Link to="/">Main</Link>
              </li>
              <li>
                <Link to="/courses">Courses</Link>
              </li>
              <li>
                <Link to="/login">Login</Link>
              </li>
            </ul>
          </nav>

          <Switch>
            <Route path="/courses">
              <Courses />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/">
              <Main />
            </Route>
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
