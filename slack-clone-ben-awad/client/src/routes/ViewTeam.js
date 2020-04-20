import React from "react";

import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
import Messages from "../components/Messages";
import Sidebar from "../containers/Sidebar";

const ViewTeam = ({ match: { params } }) => {
  return (
    <AppLayout>
      <Sidebar currentTeamId={params.teamId} />
      <Header channelName="general" />
      <Messages>
        <ul className="message-list">
          <li>1</li>
          <li>2</li>
        </ul>
      </Messages>

      <SendMessage channelName={"Hello"} />
    </AppLayout>
  );
};

export default ViewTeam;
