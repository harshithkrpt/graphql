import React, { useEffect } from "react";

import { Comment, Button } from "semantic-ui-react";

import {
  MESSAGES_QUERY,
  CREATE_NEW_MESSAGE_SUBSCRIPTION,
} from "../queries/user";
import { useQuery } from "@apollo/react-hooks";
import FileUpload from "../components/FileUpload";
import RenderText from "../components/RenderText";
import { useState } from "react";

const Message = ({ message: { url, text, filetype } }) => {
  if (url) {
    if (filetype.startsWith("image/")) return <img src={url} alt="" />;
    else if (filetype === "text/plain") {
      return <RenderText url={url} />;
    } else if (filetype.startsWith("audio/")) {
      return (
        <div>
          <audio controls>
            <source src={url} type={filetype} />
          </audio>
        </div>
      );
    }
  }
  return <Comment.Text>{text}</Comment.Text>;
};

const MessageContainer = ({ channelId }) => {
  const [hasMoreItems, setHasMoreItems] = useState(true);
  const { data, loading, subscribeToMore, fetchMore } = useQuery(
    MESSAGES_QUERY,
    {
      fetchPolicy: "network-only",
      variables: { channelId, offset: 0 },
    }
  );

  useEffect(
    () =>
      subscribeToMore({
        document: CREATE_NEW_MESSAGE_SUBSCRIPTION,
        variables: { channelId },
        updateQuery: (prev, { subscriptionData }) => {
          if (!subscriptionData) {
            return prev;
          }

          return {
            ...prev,
            messages: [
              subscriptionData.data.newChannelMessage,
              ...prev.messages,
            ],
          };
        },
      }),
    [channelId, subscribeToMore]
  );

  if (loading || !data.messages) {
    return null;
  }

  const { messages } = data;
  return (
    <FileUpload
      style={{
        gridColumn: 3,
        gridRow: 2,
        paddingLeft: 20,
        paddingRight: 20,
        overflowY: "auto",
      }}
      channelId={channelId}
      disableClicking={true}
    >
      <Comment.Group>
        {hasMoreItems && (
          <Button
            onClick={(e) => {
              fetchMore({
                variables: {
                  channelId,
                  offset: messages.length,
                },
                updateQuery: (previousResult, { fetchMoreResult }) => {
                  if (!fetchMoreResult) {
                    return previousResult;
                  }

                  if (fetchMoreResult.messages.length < 35) {
                    setHasMoreItems(false);
                  }

                  return {
                    ...previousResult,
                    messages: [
                      ...previousResult.messages,
                      ...fetchMoreResult.messages,
                    ],
                  };
                },
              });
            }}
          >
            Load More
          </Button>
        )}
        {messages
          .slice()
          .reverse()
          .map((m) => (
            <Comment key={`${m.id}-message`}>
              <Comment.Content>
                <Comment.Author as="a">{m.user.username}</Comment.Author>
                <Comment.Metadata>
                  <div>
                    {new Date(parseInt(m.createdAt)).toLocaleTimeString()}
                  </div>
                </Comment.Metadata>
                <Message message={m} />
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
      </Comment.Group>
    </FileUpload>
  );
};

export default MessageContainer;
