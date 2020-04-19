import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <Link to="/register">Register</Link>
      <br />
      <Link to="/">Home</Link>
    </div>
  );
};

export default Navbar;
