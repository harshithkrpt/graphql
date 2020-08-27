import React from "react";
import { Box, IconButton } from "@chakra-ui/core";
import { useDeletePostMutation, useMeQuery } from "../generated/graphql";
import NextLink from "next/link";

interface EditDeletePostButtonProps {
  id: number;
  creatorId: number;
}

export const EditDeletePostButton: React.FC<EditDeletePostButtonProps> = ({
  id,
  creatorId,
}) => {
  const [{ data: meData }] = useMeQuery();
  const [, deletePost] = useDeletePostMutation();

  if (meData?.me?.id !== creatorId) {
    return null;
  }

  return (
    <Box>
      <NextLink href="/post/edit/[id]" as={`/post/edit/${id}`}>
        <IconButton
          ml="auto"
          icon="edit"
          aria-label="Edit Post"
          mr={2}
          onClick={() => {
            // editPost({ id: p.id });
          }}
        />
      </NextLink>

      <IconButton
        ml="auto"
        icon="delete"
        aria-label="Delete Post"
        onClick={() => {
          deletePost({ id });
        }}
      />
    </Box>
  );
};
