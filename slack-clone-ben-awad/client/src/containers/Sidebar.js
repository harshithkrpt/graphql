import React, { useState } from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import AddChannelModal from "../components/AddChannelModal";
import InvitePeopleModal from "../components/InvitePeopleModal";
import DirectMessageModal from "../components/DirectMessageModal";

const Sidebar = ({ teams, team, username, currentUserId }) => {
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

  const regularChannels = [];
  const dmChannels = [];

  team.channels.forEach((c) => {
    if (c.dm) {
      dmChannels.push(c);
    } else {
      regularChannels.push(c);
    }
  });

  return (
    <>
      <Teams teams={teams} />
      <Channels
        teamName={team.name}
        username={username}
        teamId={team.id}
        owner={team.owner}
        channels={regularChannels}
        isOwner={team.admin}
        dmChannels={dmChannels}
        onAddChannelClick={toggleAddChannelModal}
        onInvitePeopleClick={toggleInvitePeopleModal}
        onDirectMessageClick={toggleDirectMessageModal}
      />
      <AddChannelModal
        teamId={team.id}
        open={openAddChannelModal}
        onClose={toggleAddChannelModal}
        currentUserId={currentUserId}
      />
      <InvitePeopleModal
        teamId={team.id}
        open={openInvitePeopleModal}
        onClose={toggleInvitePeopleModal}
      />
      <DirectMessageModal
        currentUserId={currentUserId}
        teamId={team.id}
        open={openDirectMessageModal}
        onClose={toggleDirectMessageModal}
      />
    </>
  );
};

export default Sidebar;
