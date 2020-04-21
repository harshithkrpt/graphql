import React from "react";
import styled from "styled-components";
import { Header } from "semantic-ui-react";

const HeaderWraper = styled.div`
  grid-column: 3;
  grid-row: 1;
`;

export default ({ channelName }) => {
  return (
    <HeaderWraper>
      <Header textAlign="center"># {channelName}</Header>
    </HeaderWraper>
  );
};
