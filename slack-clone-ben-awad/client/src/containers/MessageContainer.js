import React, { useEffect } from "react";
import Messages from "../components/Messages";
import { Comment } from "semantic-ui-react";

import {
  MESSAGES_QUERY,
  CREATE_NEW_MESSAGE_SUBSCRIPTION,
} from "../queries/user";
import { useQuery } from "@apollo/react-hooks";

const MessageContainer = ({ channelId }) => {
  const { data, loading, subscribeToMore } = useQuery(MESSAGES_QUERY, {
    variables: { channelId },
  });

  useEffect(() => {
    const unsuscribe = subscribeToMore({
      document: CREATE_NEW_MESSAGE_SUBSCRIPTION,
      variables: { channelId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData) {
          return prev;
        }
        console.log(subscriptionData);
        return {
          ...prev,
          messages: [...prev.messages, subscriptionData.data.newChannelMessage],
        };
      },
    });
    return () => unsuscribe();
  }, [channelId, subscribeToMore]);

  if (loading) {
    return null;
  }

  const { messages } = data;
  return (
    <Messages>
      <Comment.Group>
        {messages.map((m) => (
          <Comment key={`${m.id}-message`}>
            <Comment.Content>
              <Comment.Author as="a">{m.user.username}</Comment.Author>
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

export default MessageContainer;
