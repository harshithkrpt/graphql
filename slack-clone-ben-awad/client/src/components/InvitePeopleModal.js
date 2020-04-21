import React, { useState } from "react";
import { Modal, Button, Input, Form, Message } from "semantic-ui-react";

import { ADD_TEAM_MEMBER } from "../queries/team";
import { useMutation } from "@apollo/react-hooks";

const InvitePeopleModal = ({ open, onClose, teamId }) => {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [addTeamMember, { loading }] = useMutation(ADD_TEAM_MEMBER);
  const handleChange = (e) => {
    setEmailError("");
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    try {
      const res = await addTeamMember({
        variables: { teamId: parseInt(teamId, 10), email },
      });
      const { ok, errors } = res.data.addTeamMember;
      if (ok) {
        setEmail("");
        onClose();
      } else {
        setEmailError(errors[0].message);
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Add Member To Your Team</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field error={!!emailError}>
            <Input
              value={email}
              onChange={handleChange}
              fluid
              placeholder="Email"
            />
          </Form.Field>
          <Form.Group>
            <Button onClick={onClose} fluid>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleSubmit} fluid>
              Add
            </Button>
          </Form.Group>
        </Form>
        {emailError && (
          <Message error header="Validation Error" list={[emailError]} />
        )}
      </Modal.Content>
    </Modal>
  );
};

export default InvitePeopleModal;
