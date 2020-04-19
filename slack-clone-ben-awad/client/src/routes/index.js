import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Home from "./Home";
import Register from "./Register";
import Navbar from "../components/Navbar";

const Routes = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register" exact component={Register} />
      </Switch>
    </BrowserRouter>
  );
};

export default Routes;
