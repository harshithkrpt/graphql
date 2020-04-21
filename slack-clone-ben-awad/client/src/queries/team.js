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

export const ME_QUERY = gql`
  query {
    me {
      id
      username
      teams {
        id
        name
        admin
        channels {
          id
          name
        }
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

export const ADD_TEAM_MEMBER = gql`
  mutation($email: String!, $teamId: Int!) {
    addTeamMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
