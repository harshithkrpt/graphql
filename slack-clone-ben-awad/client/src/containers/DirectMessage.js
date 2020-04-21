import React from "react";
import findIndex from "lodash/findIndex";
// Componenents
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
// Containers
import DirectMessageContainer from "./DirectMessageContainer";
import Sidebar from "../containers/Sidebar";
// Queries
import { ME_QUERY } from "../queries/team";
import { Redirect } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { CREATE_DIRECT_MESSAGE_MUTATION } from "../queries/user";

// THIS
const DirectMessage = ({
  match: {
    params: { teamId, userId },
  },
}) => {
  const { data, loading } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const [createDirectMessage, createDirectMessageInfo] = useMutation(
    CREATE_DIRECT_MESSAGE_MUTATION
  );
  if (loading) {
    return null;
  }
  const { teams, username } = data.me;

  if (!teams.length) {
    return <Redirect to="/createteam" />;
  }

  let teamIdInteger = parseInt(teamId, 10);

  // To Get The Team Index That you are in
  const teamIdx = teamIdInteger ? findIndex(teams, ["id", teamIdInteger]) : 0;
  // Get the Team
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
  // GET Current Channel or default Channel

  const handleSubmit = async (text) => {
    await createDirectMessage({
      variables: {
        receiverId: parseInt(userId, 10),
        text,
        teamId: parseInt(teamId, 10),
      },
    });
  };

  return (
    <AppLayout>
      <Sidebar
        teams={teams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        currentTeamId={teamId}
        team={team}
        username={username}
      />
      <Header channelName={"Some Ones User Name"} />
      <DirectMessageContainer teamId={teamId} userId={userId} />
      <SendMessage
        isLoading={createDirectMessageInfo.loading}
        onSubmit={handleSubmit}
        placeholder={userId}
      />
    </AppLayout>
  );
};

export default DirectMessage;
