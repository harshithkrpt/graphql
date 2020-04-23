import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";

import { ApolloLink, from, split } from "apollo-link";
// import { HttpLink } from "apollo-link-http";
import { WebSocketLink } from "apollo-link-ws";
import { getMainDefinition } from "apollo-utilities";

import {
  LOCAL_STORAGE_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from "./utils/constants";
import createFileLink from "./createFileLink";

// MiddleWare
const authMiddleWare = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => {
    return {
      headers: {
        ...headers,
        "x-token": localStorage.getItem(LOCAL_STORAGE_TOKEN),
        "x-refresh-token": localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN),
      },
    };
  });

  return forward(operation);
});

// AfterWare;
const authAfterWare = new ApolloLink((operation, forward) => {
  return forward(operation).map((response) => {
    const context = operation.getContext();
    // STORE TO LOCAL STORAGE
    const { headers } = context.response;

    if (headers.get("x-token") && headers.get("x-refresh-token")) {
      localStorage.setItem(LOCAL_STORAGE_TOKEN, headers.get("x-token"));
      localStorage.setItem(
        LOCAL_STORAGE_REFRESH_TOKEN,
        headers.get("x-refresh-token")
      );
    }

    return response;
  });
});

// HTTP LINK
const httpLink = createFileLink({
  uri: "http://localhost:8080/graphql",
});

// WS LINK
const wsLink = new WebSocketLink({
  uri: `ws://localhost:8080/subscriptions`,
  options: {
    reconnect: true,
    connectionParams: {
      token: localStorage.getItem(LOCAL_STORAGE_TOKEN),
      refreshToken: localStorage.getItem(LOCAL_STORAGE_REFRESH_TOKEN),
    },
  },
});

const httpLinkWithMiddleware = from([authMiddleWare, authAfterWare, httpLink]);

const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  httpLinkWithMiddleware
);

export const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});
