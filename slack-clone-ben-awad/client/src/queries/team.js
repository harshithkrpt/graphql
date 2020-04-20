import gql from "graphql-tag";

export const CREATETEAM = gql`
  mutation($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export const GETALLTEAMS = gql`
  query {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export const CREATECHANNEL = gql`
  mutation($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;
