import React, { useState } from "react";
import styled from "styled-components";
import { Button, Icon, Input } from "semantic-ui-react";
import FileUpload from "./FileUpload";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  padding: 20px;
  display: grid;
  grid-template-columns: 10% 90%;
`;

const SendMessage = ({ onSubmit, placeholder, isLoading, channelId }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async () => {
    if (!message || !message.trim()) {
      setMessage("");
      return;
    }
    const newMessage = message;
    setMessage("");
    await onSubmit(newMessage);
  };

  return (
    <SendMessageWrapper>
      <FileUpload channelId={channelId}>
        <Button style={{ width: 100 }} icon>
          <Icon name="plus" />
        </Button>
      </FileUpload>

      <Input
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !isLoading) {
            handleSubmit();
          }
        }}
        value={message}
        placeholder={placeholder}
        onChange={handleChange}
      />
    </SendMessageWrapper>
  );
};

export default SendMessage;
