import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import findIndex from "lodash/findIndex";
import { Modal, Button, Form } from "semantic-ui-react";

import { GET_OR_CREATE_CHANNEL } from "../queries/user";
import { ME_QUERY } from "../queries/team";
import { useMutation } from "@apollo/react-hooks";
import MultiSelectUsers from "./MultiSelectUsers";

const DirectMessageModal = ({
  open,
  onClose,
  teamId,
  currentUserId,
  history,
}) => {
  const [members, setMembers] = useState([]);
  const [getOrCreateChannel, { loading }] = useMutation(GET_OR_CREATE_CHANNEL);

  const handleSubmit = async () => {
    await getOrCreateChannel({
      variables: {
        teamId: parseInt(teamId, 10),
        members,
      },
      update: (store, { data: { getOrCreateChannel } }) => {
        const { id, name } = getOrCreateChannel;
        const data = store.readQuery({ query: ME_QUERY });
        const teamIdx = findIndex(data.me.teams, ["id", teamId]);
        const notInChannelList = data.me.teams[teamIdx].channels.every(
          (c) => c.id !== id
        );
        if (notInChannelList) {
          data.me.teams[teamIdx].channels.push({
            id,
            name,
            dm: true,
            __typename: "Channel",
          });
          store.writeQuery({ query: ME_QUERY, data });
        }
        history.push(`/viewteam/${teamId}/${id}`);
      },
    });

    setMembers([]);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => {
        setMembers("");
        onClose();
      }}
    >
      <Modal.Header>Direct Messaging</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <MultiSelectUsers
              handleChange={(e, { value }) => setMembers(value)}
              teamId={parseInt(teamId, 10)}
              placeholder="Select Members to invite"
              currentUserId={currentUserId}
              value={members}
            />
          </Form.Field>
          <Form.Group>
            <Button disabled={loading} onClick={onClose} fluid>
              Cancel
            </Button>
            <Button disabled={loading} onClick={handleSubmit} fluid>
              Start Messaging
            </Button>
          </Form.Group>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default withRouter(DirectMessageModal);
