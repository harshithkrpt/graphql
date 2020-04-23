import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  Container,
  Message,
  Input,
  Header,
  Button,
  Form,
} from "semantic-ui-react";
import { REGISTER } from "../queries/user";

const Register = (props) => {
  // Values
  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });
  // Errors
  const [errors, setErrors] = useState({
    usernameError: "",
    emailError: "",
    passwordError: "",
  });
  const [register, { loading }] = useMutation(REGISTER);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Clear Errors
    setErrors({ usernameError: "", emailError: "", passwordError: "" });
    const { username, email, password } = values;

    const res = await register({ variables: { username, email, password } });
    const { ok, errors } = res.data.register;

    if (ok) {
      props.history.push("/login");
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      setErrors(err);
    }
  };

  const { username, email, password } = values;
  const { usernameError, emailError, passwordError } = errors;

  const errorList = [];

  if (usernameError) {
    errorList.push(usernameError);
  }
  if (emailError) {
    errorList.push(emailError);
  }
  if (passwordError) {
    errorList.push(passwordError);
  }

  return (
    <Container>
      <Header as="h2">Register</Header>
      <Form>
        <Form.Field error={!!usernameError}>
          <Input
            value={username}
            placeholder="Username"
            fluid
            name="username"
            onChange={handleChange}
          />
        </Form.Field>

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

      {(usernameError || emailError || passwordError) && (
        <Message error header="Validation Error" list={errorList} />
      )}
    </Container>
  );
};

export default Register;
