import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient } from "apollo-client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloProvider } from "@apollo/react-hooks";
import { ApolloLink, from } from "apollo-link";
import { HttpLink } from "apollo-link-http";

import "semantic-ui-css/semantic.min.css";

import App from "./App";
import {
  LOCAL_STORAGE_TOKEN,
  LOCAL_STORAGE_REFRESH_TOKEN,
} from "./utils/constants";

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

const httpLink = new HttpLink({
  uri: "http://localhost:8080/graphql",
});

const client = new ApolloClient({
  link: from([authMiddleWare, authAfterWare, httpLink]),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);
