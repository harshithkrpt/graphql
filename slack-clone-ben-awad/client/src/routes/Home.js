import React from "react";
import { useQuery } from "@apollo/react-hooks";
import gql from "graphql-tag";

const QUERY = gql`
  {
    allUsers {
      id
      username
    }
  }
`;

const ApolloTest = () => {
  const { data, loading } = useQuery(QUERY);
  if (loading) return "Loading";

  return <div>{JSON.stringify(data)}</div>;
};

export default ApolloTest;
