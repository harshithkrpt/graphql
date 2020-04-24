import gql from "graphql-tag";
export const REGISTER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export const LOGIN = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export const CREATE_MESSAGE_MUTATION = gql`
  mutation($channelId: Int!, $text: String!) {
    createMessage(channelId: $channelId, text: $text)
  }
`;

export const CREATE_DIRECT_MESSAGE_MUTATION = gql`
  mutation($receiverId: Int!, $text: String!, $teamId: Int!) {
    createDirectMessage(receiverId: $receiverId, text: $text, teamId: $teamId)
  }
`;

export const GET_OR_CREATE_CHANNEL = gql`
  mutation($teamId: Int!, $members: [Int!]!) {
    getOrCreateChannel(teamId: $teamId, members: $members) {
      id
      name
    }
  }
`;

export const MESSAGES_QUERY = gql`
  query($offset: Int!, $channelId: Int!) {
    messages(offset: $offset, channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
      createdAt
    }
  }
`;

export const DIRECT_MESSAGE_QUERY = gql`
  query($teamId: Int!, $otherUserId: Int!) {
    directMessages(teamId: $teamId, otherUserId: $otherUserId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

export const CREATE_NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription($channelId: Int!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      user {
        username
      }
      url
      filetype
      createdAt
    }
  }
`;

export const CREATE_DIRECT_MESSAGE_SUBSCRIPTION = gql`
  subscription($teamId: Int!, $otherUserId: Int!) {
    newDirectMessage(teamId: $teamId, userId: $otherUserId) {
      id
      sender {
        username
      }
      text
      createdAt
    }
  }
`;

export const GET_TEAM_MEMBERS_QUERY = gql`
  query($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      id
      username
    }
  }
`;
