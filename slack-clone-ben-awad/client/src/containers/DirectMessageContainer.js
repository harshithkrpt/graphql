import React, { useEffect } from "react";
import Messages from "../components/Messages";
import { Comment } from "semantic-ui-react";

import {
  DIRECT_MESSAGE_QUERY,
  CREATE_DIRECT_MESSAGE_SUBSCRIPTION,
} from "../queries/user";
import { useQuery } from "@apollo/react-hooks";

const DirectMessageContainer = ({ teamId, userId }) => {
  const { data, loading, subscribeToMore } = useQuery(DIRECT_MESSAGE_QUERY, {
    fetchPolicy: "network-only",
    variables: {
      teamId: parseInt(teamId, 10),
      otherUserId: parseInt(userId, 10),
    },
  });

  useEffect(() => {
    console.log("Mounting Direct Message");
    const unsubscribe = subscribeToMore({
      document: CREATE_DIRECT_MESSAGE_SUBSCRIPTION,
      variables: {
        teamId: parseInt(teamId, 10),
        otherUserId: parseInt(userId, 10),
      },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }

        return {
          ...prev,
          directMessages: [
            ...prev.directMessages,
            subscriptionData.data.newDirectMessage,
          ],
        };
      },
    });
    return () => {
      console.log("UnMounting Direct Message");
      unsubscribe();
    };
  }, [teamId, userId, subscribeToMore]);

  if (loading) {
    return null;
  }

  const { directMessages } = data;
  return (
    <Messages>
      <Comment.Group>
        {directMessages.map((m) => (
          <Comment key={`${m.id}-direct-message`}>
            <Comment.Content>
              <Comment.Author as="a">{m.sender.username}</Comment.Author>
              <Comment.Metadata>
                <div>
                  {new Date(parseInt(m.createdAt)).toLocaleTimeString()}
                </div>
              </Comment.Metadata>
              <Comment.Text>{m.text}</Comment.Text>
              <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
              </Comment.Actions>
            </Comment.Content>
          </Comment>
        ))}
      </Comment.Group>
    </Messages>
  );
};

export default DirectMessageContainer;
