import React from "react";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";

import Login from "./Login";
import CreateTeam from "./CreateTeam";

import decode from "jwt-decode";
import {
  LOCAL_STORAGE_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from "../utils/constants";
import ViewTeam from "./ViewTeam";
import DirectMessage from "../containers/DirectMessage";

const isAuthenticated = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
  const refreshToken = localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN);
  try {
    decode(token);
    decode(refreshToken);
  } catch (e) {
    return false;
  }

  return true;
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        isAuthenticated() ? (
          <Component {...props} />
        ) : (
          <Redirect to={{ pathname: "/login" }} />
        )
      }
    />
  );
};

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
        <Route path="/login" exact component={Login} />

        <PrivateRoute
          exact
          path="/viewteam/user/:teamId/:userId"
          component={DirectMessage}
        />
        <PrivateRoute
          path="/viewteam/:teamId?/:channelId?"
          exact
          component={ViewTeam}
        />

        <PrivateRoute path="/createteam" exact component={CreateTeam} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
