import React from "react";
import { gql } from "apollo-boost";
import { useMutation } from "@apollo/react-hooks";
import { setAccessToken } from "./accessToken";

const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;

export default () => {
  const [logout] = useMutation(LOGOUT);
  const handleLogout = async (e) => {
    await logout();
    setAccessToken("");
  };
  return <button onClick={handleLogout}>Logout</button>;
};
