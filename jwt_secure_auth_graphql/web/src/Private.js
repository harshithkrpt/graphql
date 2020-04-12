import React from "react";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

const QUERY = gql`
  {
    bye
  }
`;

const Private = () => {
  const { data, error } = useQuery(QUERY, { fetchPolicy: "network-only" });

  if (error) {
    return <div>Error</div>;
  }

  if (!data) return "Loading";

  return <div>{data.bye}</div>;
};

export default Private;
