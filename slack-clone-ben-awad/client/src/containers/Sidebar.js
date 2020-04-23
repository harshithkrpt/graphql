import React, { useState } from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";
import DirectMessageModal from "../components/DirectMessageModal";

const Sidebar = ({ teams, team, username }) => {
  const [openAddChannelModal, setOpenAddChannelModal] = useState(false);
  const [openInvitePeopleModal, setOpenInvitePeopleModal] = useState(false);
  const [openDirectMessageModal, setOpenDirectMessageModal] = useState(false);

  const toggleAddChannelModal = (e) => {
    setOpenAddChannelModal(!openAddChannelModal);
  };

  const toggleInvitePeopleModal = (e) => {
    setOpenInvitePeopleModal(!openInvitePeopleModal);
  };

  const toggleDirectMessageModal = (e) => {
    setOpenDirectMessageModal(!openDirectMessageModal);
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
        users={team.directMessageMembers}
        onAddChannelClick={toggleAddChannelModal}
        onInvitePeopleClick={toggleInvitePeopleModal}
        onDirectMessageClick={toggleDirectMessageModal}
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
      <DirectMessageModal
        teamId={team.id}
        open={openDirectMessageModal}
        onClose={toggleDirectMessageModal}
      />
    </>
  );
};

export default Sidebar;
