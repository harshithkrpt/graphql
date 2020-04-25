import React, { useState } from "react";
import { wsLink } from "../apollo";

import {
  Container,
  Input,
  Header,
  Button,
  Message,
  Form,
} from "semantic-ui-react";
import { useMutation } from "@apollo/react-hooks";

import { LOGIN } from "../queries/user";
import {
  LOCAL_STORAGE_REFRESH_TOKEN,
  LOCAL_STORAGE_TOKEN,
} from "../utils/constants";

const Login = (props) => {
  // Values
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  // Errors
  const [errors, setErrors] = useState({
    emailError: "",
    passwordError: "",
  });

  const [login, { loading }] = useMutation(LOGIN);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    setErrors({ emailError: "", passwordError: "" });
    const { email, password } = values;
    const res = await login({ variables: { email, password } });

    const { ok, errors, token, refreshToken } = res.data.login;

    if (ok) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
      localStorage.setItem(LOCAL_STORAGE_REFRESH_TOKEN, refreshToken);
      wsLink.subscriptionClient.tryReconnect();
      props.history.push("/viewteam");
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      setErrors(err);
    }
  };

  const { email, password } = values;
  const { emailError, passwordError } = errors;

  const errorList = [];

  if (emailError) {
    errorList.push(emailError);
  }
  if (passwordError) {
    errorList.push(passwordError);
  }

  return (
    <Container>
      <Header as="h2">Login</Header>
      <Form>
        <Form.Field error={!!emailError}>
          <Input
            value={email}
            placeholder="Email"
            fluid
            name="email"
            onChange={handleChange}
          />
        </Form.Field>
        <Form.Field error={!!passwordError}>
          <Input
            value={password}
            placeholder="Password"
            fluid
            onChange={handleChange}
            name="password"
            type="password"
          />
        </Form.Field>
        <Button disabled={loading} onClick={handleSubmit}>
          Submit
        </Button>
      </Form>

      {(emailError || passwordError) && (
        <Message error header="Validation Error" list={errorList} />
      )}
    </Container>
  );
};

export default Login;
