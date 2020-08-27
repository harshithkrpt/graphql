import React from "react";
import { Box, Link, Flex, Button, Heading } from "@chakra-ui/core";
import NextLink from "next/link";
import { useMeQuery, useLogoutMutation } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { useRouter } from "next/router";

interface NavBarProps {}

export const NavBar: React.FC<NavBarProps> = ({}) => {
  const router = useRouter();
  const [{ data, fetching }] = useMeQuery({ pause: isServer() });
  const [{ fetching: logoutFetching }, logout] = useLogoutMutation();

  let body = null;

  if (fetching) {
  } else if (!data?.me) {
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>Login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>Register</Link>
        </NextLink>
      </>
    );
  } else {
    body = (
      <Flex align="center">
        <NextLink href="/create-post">
          <Button as={Link} mr={2}>
            Create Post
          </Button>
        </NextLink>
        <Box ml={2}>{data?.me?.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            router.reload();
          }}
          ml={2}
          variant="link"
          isLoading={logoutFetching}
        >
          Logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex zIndex={1} position="sticky" top={0} p={4} align="center">
      <NextLink href="/">
        <Link mr={2}>
          <Heading>Reddit</Heading>
        </Link>
      </NextLink>
      <Box ml={"auto"}>{body}</Box>
    </Flex>
  );
};
