import React from "react";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

export const filesQuery = gql`
  {
    files
  }
`;

export default function Files() {
  const { data, loading } = useQuery(filesQuery);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {data.files.map((x) => (
        <img
          src={`http://localhost:4000/images/${x}`}
          alt={x}
          style={{ width: 200 }}
          key={x}
        />
      ))}
    </div>
  );
}
