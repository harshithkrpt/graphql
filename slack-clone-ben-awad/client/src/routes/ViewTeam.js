import React from "react";
import findIndex from "lodash/findIndex";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { Redirect } from "react-router-dom";
// Components
import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";
// Containers
import Sidebar from "../containers/Sidebar";
import MessageContainer from "../containers/MessageContainer";
// Queries
import { ME_QUERY } from "../queries/team";
import { CREATE_MESSAGE_MUTATION } from "../queries/user";

const ViewTeam = ({
  match: {
    params: { teamId, channelId },
  },
}) => {
  const { data, loading } = useQuery(ME_QUERY, { fetchPolicy: "network-only" });
  const [createMessage, createMessageInfo] = useMutation(
    CREATE_MESSAGE_MUTATION
  );

  const handleSubmit = async (text) => {
    try {
      await createMessage({ variables: { text, channelId: channel.id } });
    } catch (e) {
      console.log(e);
    }
  };

  if (loading) {
    return "Loading";
  }

  const { teams, username } = data.me;

  if (!teams.length) {
    return <Redirect to="/createteam" />;
  }

  let teamIdInteger = parseInt(teamId, 10);
  let channelIdInteger = parseInt(channelId, 10);

  // To Get The Team Index That you are in
  const teamIdx = teamIdInteger ? findIndex(teams, ["id", teamIdInteger]) : 0;
  // Get the Team
  const team = teamIdx === -1 ? teams[0] : teams[teamIdx];
  // GET Current Channel or default Channel
  const channelIdx = channelIdInteger
    ? findIndex(team.channels, ["id", channelIdInteger])
    : 0;
  const channel = teamIdx === -1 ? team.channels[0] : team.channels[channelIdx];

  return (
    !loading && (
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
        {channel && <Header channelName={channel.name} />}
        {channel && <MessageContainer channelId={channel.id} />}

        <SendMessage
          isLoading={createMessageInfo.loading}
          onSubmit={handleSubmit}
          placeholder={channel.name}
          channelId={channel.id}
        />
      </AppLayout>
    )
  );
};

export default ViewTeam;
