import React from "react";
import findIndex from "lodash/findIndex";
import { Redirect } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/react-hooks";
// Componenents
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
// Containers
import DirectMessageContainer from "../containers/DirectMessageContainer";
import Sidebar from "../containers/Sidebar";
// Queries
import { ME_QUERY, DIRECT_MESSAGE_ME_QUERY } from "../queries/team";
import { CREATE_DIRECT_MESSAGE_MUTATION } from "../queries/user";

// THIS
const DirectMessage = ({
  match: {
    params: { teamId, userId },
  },
}) => {
  const { data, loading } = useQuery(DIRECT_MESSAGE_ME_QUERY, {
    variables: { userId: parseInt(userId, 10) },
    fetchPolicy: "network-only",
  });
  const [createDirectMessage, createDirectMessageInfo] = useMutation(
    CREATE_DIRECT_MESSAGE_MUTATION
  );

  if (loading) {
    return "Loading";
  }

  const {
    me: { teams, username },
    getUser,
  } = data;

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
        teamId: team.id,
      },
      optimisticResponse: {
        createDirectMessage: true,
      },
      update: (store) => {
        const data = store.readQuery({ query: ME_QUERY });
        const teamIdx2 = findIndex(data.me.teams, ["id", team.id]);
        const notAlreadyThere = data.me.teams[
          teamIdx2
        ].directMessageMembers.every(
          (member) => member.id !== parseInt(userId, 10)
        );
        if (notAlreadyThere) {
          data.me.teams[teamIdx2].directMessageMembers.push({
            __typename: "User",
            id: userId,
            username: getUser.username,
          });
          store.writeQuery({ query: ME_QUERY, data });
        }
      },
    });
  };

  return (
    !loading && (
      <AppLayout>
        <Sidebar
          teams={teams.map((t) => ({
            id: t.id,
            letter: t.name.charAt(0).toUpperCase(),
          }))}
          currentTeamId={team.id}
          team={team}
          username={username}
        />
        <Header channelName={getUser.username} />
        <DirectMessageContainer teamId={team.id} userId={userId} />
        <SendMessage
          isLoading={createDirectMessageInfo.loading}
          onSubmit={handleSubmit}
          placeholder={userId}
        />
      </AppLayout>
    )
  );
};

export default DirectMessage;
