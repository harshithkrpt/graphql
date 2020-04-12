import React from "react";
import { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import { setAccessToken } from "./accessToken";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
    }
  }
`;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login] = useMutation(LOGIN);

  const handleSubmit = async (e) => {
    const res = await login({ variables: { email, password } });
    console.log(res);

    if (res && res.data) {
      setAccessToken(res.data.login.accessToken);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
        }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
      />
      <button onClick={handleSubmit}>Login</button>
    </div>
  );
};

export default Login;
