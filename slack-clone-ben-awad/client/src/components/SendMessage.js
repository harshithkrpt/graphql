import React, { useState } from "react";
import styled from "styled-components";
import { Input } from "semantic-ui-react";

const SendMessageWrapper = styled.div`
  grid-column: 3;
  grid-row: 3;
  margin: 20px;
  padding: 20px;
`;

const SendMessage = ({ onSubmit, placeholder, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e) => {
    if (!message || !message.trim()) {
      setMessage("");
      return;
    }

    await onSubmit(message);
    setMessage("");
  };

  return (
    <SendMessageWrapper>
      <Input
        onKeyDown={(e) => {
          if (e.keyCode === 13 && !isLoading) {
            handleSubmit(e);
          }
        }}
        value={message}
        fluid
        placeholder={placeholder}
        onChange={handleChange}
      />
    </SendMessageWrapper>
  );
};

export default SendMessage;
