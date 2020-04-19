import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { Container, Message, Input, Header, Button } from "semantic-ui-react";
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
    setErrors({ useMutationError: "", emailError: "", passwordError: "" });
    const { username, email, password } = values;

    const res = await register({ variables: { username, email, password } });
    const { ok, errors } = res.data.register;

    if (ok) {
      props.history.push("/");
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
      <Input
        error={!!usernameError}
        value={username}
        placeholder="Username"
        fluid
        name="username"
        onChange={handleChange}
      />
      <br />
      <Input
        error={!!emailError}
        value={email}
        placeholder="Email"
        fluid
        name="email"
        onChange={handleChange}
      />
      <br />
      <Input
        error={!!passwordError}
        value={password}
        placeholder="Password"
        fluid
        onChange={handleChange}
        name="password"
        type="password"
      />
      <br />
      <Button disabled={loading} onClick={handleSubmit}>
        Submit
      </Button>
      {(usernameError || emailError || passwordError) && (
        <Message error header="Validation Error" list={errorList} />
      )}
    </Container>
  );
};

export default Register;
