import React from "react";
import { useQuery } from "@apollo/react-hooks";

import Header from "../components/Header";
import SendMessage from "../components/SendMessage";
import AppLayout from "../components/AppLayout";

import Sidebar from "../containers/Sidebar";
import findIndex from "lodash/findIndex";

import { GETALLTEAMS } from "../queries/team";
import { Redirect } from "react-router-dom";
import MessageContainer from "../containers/MessageContainer";

const ViewTeam = ({
  match: {
    params: { teamId, channelId },
  },
}) => {
  const { data, loading } = useQuery(GETALLTEAMS);
  if (loading) {
    return null;
  }

  const { allTeams, inviteTeams } = data;

  const teams = [...allTeams, ...inviteTeams];

  if (!allTeams.length) {
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
    <AppLayout>
      <Sidebar
        teams={teams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
        currentTeamId={teamId}
        team={team}
      />
      {channel && <Header channelName={channel.name} />}
      {channel && <MessageContainer channelId={channel.id} />}

      <SendMessage channelId={channel.id} channelName={channel.name} />
    </AppLayout>
  );
};

export default ViewTeam;
