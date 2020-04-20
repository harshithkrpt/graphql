import React, { useState } from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  Container,
  Input,
  Header,
  Button,
  Form,
  Message,
} from "semantic-ui-react";

import { CREATETEAM } from "../queries/team";

const CreateTeam = (props) => {
  // Values
  const [values, setValues] = useState({
    name: "",
  });
  // Errors
  const [errors, setErrors] = useState({
    nameError: "",
  });

  const [createTeam, { loading }] = useMutation(CREATETEAM);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    // Clear Errors
    setErrors({ nameError: "" });
    const { name } = values;

    let res = null;
    try {
      res = await createTeam({ variables: { name } });
    } catch (e) {
      props.history.push("/login");
      return;
    }
    const { ok, errors, team } = res.data.createTeam;

    if (ok) {
      props.history.push(`/viewteam/${team.id}`);
    } else {
      const err = {};
      errors.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });

      setErrors(err);
    }
  };

  const { name } = values;
  const { nameError } = errors;

  const errorList = [];

  if (nameError) {
    errorList.push(nameError);
  }

  return (
    <Container>
      <Header as="h2">Create Team</Header>
      <Form>
        <Form.Field error={!!nameError}>
          <Input
            value={name}
            placeholder="Team Name"
            fluid
            name="name"
            onChange={handleChange}
          />
        </Form.Field>

        <Button disabled={loading} onClick={handleSubmit}>
          Submit
        </Button>
      </Form>

      {nameError && (
        <Message error header="Team Creation Error" list={errorList} />
      )}
    </Container>
  );
};

export default CreateTeam;
