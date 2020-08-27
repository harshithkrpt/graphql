import React from "react";
import { withUrqlClient } from "next-urql";
import { createURQLClient } from "../../utils/createURQLClient";

import { Layout } from "../../components/Layout";
import { Box, Heading } from "@chakra-ui/core";
import { useGetPostFromURL } from "../../utils/useGetPostFromURL";
import { EditDeletePostButton } from "../../components/EditDeletePostButton";

const Post = ({}) => {
  const [{ data, error: err, fetching }] = useGetPostFromURL();

  if (err) {
    return <div>{err?.message}</div>;
  }

  if (!data?.post) {
    return (
      <Layout>
        <Box>Could not find post</Box>
      </Layout>
    );
  }

  if (fetching) {
    return (
      <Layout>
        <div>...Loading</div>
      </Layout>
    );
  }

  return (
    <Layout>
      {<Heading mb={4}>{data.post.title}</Heading>}

      <Box mb={4}>{data.post.text}</Box>

      <EditDeletePostButton
        id={data.post.id}
        creatorId={data.post.creator.id}
      />
    </Layout>
  );
};

export default withUrqlClient(createURQLClient, { ssr: true })(Post);
