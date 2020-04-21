import React, { useState } from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";

const Sidebar = ({ teams, team, username }) => {
  const [openAddChannelModal, setOpenAddChannelModal] = useState(false);
  const [openInvitePeopleModal, setOpenInvitePeopleModal] = useState(false);

  const toggleAddChannelModal = (e) => {
    setOpenAddChannelModal(!openAddChannelModal);
  };

  const toggleInvitePeopleModal = (e) => {
    setOpenInvitePeopleModal(!openInvitePeopleModal);
  };

  return (
    <>
      <Teams teams={teams} />
      <Channels
        teamName={team.name}
        username={username}
        teamId={team.id}
        owner={team.owner}
        channels={team.channels}
        isOwner={team.admin}
        users={[
          { id: 1, name: "slack" },
          { id: 2, name: "user1" },
        ]}
        onAddChannelClick={toggleAddChannelModal}
        onInvitePeopleClick={toggleInvitePeopleModal}
      />
      <AddChannelModal
        teamId={team.id}
        open={openAddChannelModal}
        onClose={toggleAddChannelModal}
      />
      <InvitePeopleModal
        teamId={team.id}
        open={openInvitePeopleModal}
        onClose={toggleInvitePeopleModal}
      />
    </>
  );
};

export default Sidebar;
