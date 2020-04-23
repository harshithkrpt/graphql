import React from "react";
import { withRouter } from "react-router-dom";

import { Modal, Button, Input, Form } from "semantic-ui-react";
import Downshift from "downshift";

import { GET_TEAM_MEMBERS_QUERY } from "../queries/user";
import { useQuery } from "@apollo/react-hooks";

const DirectMessageModal = ({ open, onClose, teamId, history }) => {
  const { data, loading } = useQuery(GET_TEAM_MEMBERS_QUERY, {
    variables: {
      teamId: parseInt(teamId, 10),
    },
  });

  if (loading) {
    return null;
  }

  const { getTeamMembers } = data;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Header>Search Users</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <Downshift
              onChange={(selection) => {
                history.push(`/viewteam/user/${teamId}/${selection.id}`);
                onClose();
              }}
              itemToString={(item) => (item ? item.username : "")}
            >
              {({
                getInputProps,
                getItemProps,
                getMenuProps,
                isOpen,
                inputValue,
                highlightedIndex,
                selectedItem,
                getRootProps,
              }) => (
                <div>
                  <div
                    style={{ display: "inline-block" }}
                    {...getRootProps({}, { suppressRefError: true })}
                  >
                    <Input
                      {...getInputProps({
                        placeholder: "Enter UserName",
                      })}
                    />
                  </div>
                  <ul {...getMenuProps()}>
                    {isOpen
                      ? getTeamMembers
                          .filter(
                            (item) =>
                              !inputValue || item.username.includes(inputValue)
                          )
                          .map((item, index) => (
                            <li
                              {...getItemProps({
                                key: item.id,
                                index,
                                item,
                                style: {
                                  backgroundColor:
                                    highlightedIndex === index
                                      ? "lightgray"
                                      : "white",
                                  fontWeight:
                                    selectedItem === item ? "bold" : "normal",
                                },
                              })}
                            >
                              {item.username}
                            </li>
                          ))
                      : null}
                  </ul>
                </div>
              )}
            </Downshift>
          </Form.Field>
          <Button onClick={onClose} fluid>
            Cancel
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default withRouter(DirectMessageModal);
