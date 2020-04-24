import React from "react";
import { GET_TEAM_MEMBERS_QUERY } from "../queries/user";
import { Dropdown } from "semantic-ui-react";
import { useQuery } from "@apollo/react-hooks";

const MultiSelectUsers = ({
  teamId,
  placeholder,
  handleChange,
  currentUserId,
  value,
}) => {
  const { data, loading } = useQuery(GET_TEAM_MEMBERS_QUERY, {
    variables: { teamId },
  });

  if (loading) {
    return null;
  }

  const { getTeamMembers = [] } = data;

  return (
    <Dropdown
      value={value}
      fluid
      placeholder={placeholder}
      multiple
      selection
      search
      options={getTeamMembers
        .filter((tm) => tm.id !== currentUserId)
        .map((tm) => ({
          key: tm.id,
          value: tm.id,
          text: tm.username,
        }))}
      onChange={handleChange}
    ></Dropdown>
  );
};

export default MultiSelectUsers;
