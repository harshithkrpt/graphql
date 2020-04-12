import React, { useEffect } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

// Comp
import Register from "./Register";
import Login from "./Login";
import Home from "./Home";
import Private from "./Private";
import { useState } from "react";
import { setAccessToken, accessToken } from "./accessToken";
import Logout from "./Logout";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:4000/refresh_token", {
      credentials: "include",
      method: "POST",
    })
      .then((x) => x.json())
      .then((y) => {
        setAccessToken(y.accessToken.accessToken);
        console.log(accessToken);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>loading</div>;
  }

  return (
    <BrowserRouter>
      <div>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/private">Private</Link>
        <Logout />
      </div>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/private" component={Private} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
