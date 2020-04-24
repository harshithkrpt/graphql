import React, { useState } from "react";
import { Modal, Button, Input, Form, Checkbox } from "semantic-ui-react";

import { CREATECHANNEL, ME_QUERY } from "../queries/team";
import { useMutation } from "@apollo/react-hooks";
import findIndex from "lodash/findIndex";
import MultiSelectUsers from "../components/MultiSelectUsers";

const AddChannelModal = ({ open, onClose, teamId, currentUserId }) => {
  const [name, setName] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [members, setMembers] = useState([]);
  const [createChannel, { loading }] = useMutation(CREATECHANNEL);
  const handleChange = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    await createChannel({
      variables: {
        teamId: parseInt(teamId, 10),
        name,
        public: isPublic,
        members,
      },
      optimisticResponse: {
        createChannel: {
          __typename: "Mutation",
          ok: true,
          channel: {
            __typename: "Channel",
            id: -1,
            name: name,
            dm: false,
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
              name="name"
              placeholder="Channel Name"
            />
          </Form.Field>
          <Form.Field>
            <Checkbox
              checked={!isPublic}
              toggle
              label="Private"
              onChange={(e, { checked }) => setIsPublic(!checked)}
            />
          </Form.Field>
          {isPublic ? null : (
            <Form.Field>
              <MultiSelectUsers
                handleChange={(e, { value }) => setMembers(value)}
                teamId={parseInt(teamId, 10)}
                placeholder="Select Members to invite"
                currentUserId={currentUserId}
                value={members}
              />
            </Form.Field>
          )}

          <Form.Group widths="equal">
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
