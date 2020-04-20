import React, { useState } from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import { useQuery } from "@apollo/react-hooks";
import findIndex from "lodash/findIndex";
import { GETALLTEAMS } from "../queries/team";
import { getUserName } from "../utils/getUsername";
import AddChannelModal from "../components/AddChannelModal";

const Sidebar = ({ currentTeamId }) => {
  const [openModal, setOpenModal] = useState(false);
  const { data, loading } = useQuery(GETALLTEAMS);

  if (loading) {
    return "Loading";
  }

  const handleAddChannelClick = () => {
    setOpenModal(true);
  };

  const handleCloseAddChannelClick = () => {
    setOpenModal(false);
  };

  const { allTeams } = data;
  const teamIdx = currentTeamId
    ? findIndex(allTeams, ["id", parseInt(currentTeamId, 10)])
    : 0;
  const team = allTeams[teamIdx];
  const username = getUserName();
  return (
    <>
      <Teams
        teams={allTeams.map((t) => ({
          id: t.id,
          letter: t.name.charAt(0).toUpperCase(),
        }))}
      />
      <Channels
        teamName={team.name}
        username={username}
        teamId={team.id}
        channels={team.channels}
        users={[
          { id: 1, name: "slack" },
          { id: 2, name: "user1" },
        ]}
        onAddChannelClick={handleAddChannelClick}
      />
      <AddChannelModal
        teamId={team.id}
        open={openModal}
        onClose={handleCloseAddChannelClick}
      />
    </>
  );
};

export default Sidebar;
