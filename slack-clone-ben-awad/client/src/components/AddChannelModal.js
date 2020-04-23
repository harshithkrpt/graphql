import React, { useState } from "react";
import { Modal, Button, Input, Form } from "semantic-ui-react";

import { CREATECHANNEL, ME_QUERY } from "../queries/team";
import { useMutation } from "@apollo/react-hooks";
import findIndex from "lodash/findIndex";

const AddChannelModal = ({ open, onClose, teamId }) => {
  const [name, setName] = useState("");
  const [createChannel, { loading }] = useMutation(CREATECHANNEL);
  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    await createChannel({
      variables: { teamId: parseInt(teamId, 10), name },
      optimisticResponse: {
        createChannel: {
          __typename: "Mutation",
          ok: true,
          channel: {
            __typename: "Channel",
            id: -1,
            name: name,
          },
        },
      },
      update: (store, { data: { createChannel } }) => {
        const { ok, channel } = createChannel;
        if (!ok) {
          return;
        }
        const data = store.readQuery({ query: ME_QUERY });
        const teamIdx = findIndex(data.me.teams, ["id", teamId]);
        data.me.teams[teamIdx].channels.push(channel);
        store.writeQuery({ query: ME_QUERY, data });
      },
    });
    setName("");
    onClose();
  };

  const handleClose = () => {
    setName("");
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Header>Add Channel</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Input
              value={name}
              onChange={handleChange}
              fluid
              placeholder="Channel Name"
            />
          </Form.Field>
          <Form.Group>
            <Button onClick={handleClose} fluid>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleSubmit} fluid>
              Add
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default AddChannelModal;
