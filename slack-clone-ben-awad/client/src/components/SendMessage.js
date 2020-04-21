import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "semantic-ui-react";

import { CREATE_MESSAGE_MUTATION } from "../queries/user";
import { useMutation } from "@apollo/react-hooks";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
  padding: 20px;
`;

const SendMessage = ({ channelName, channelId }) => {
  const [message, setMessage] = useState("");
  const [createMessage, { loading }] = useMutation(CREATE_MESSAGE_MUTATION);
  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (!message || !message.trim()) {
      setMessage("");
      return;
    }

    await createMessage({ variables: { text: message, channelId } });
    setMessage("");
  };

  return (
    <SendMessageWrapper>
      <Input
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !loading) {
            handleSubmit(e);
          }
        }}
        value={message}
        fluid
        placeholder={`# ${channelName}`}
        onChange={handleChange}
      />
    </SendMessageWrapper>
  );
};

export default SendMessage;
