import React from "react";
import { useQuery, gql } from "@apollo/client";

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
