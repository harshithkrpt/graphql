import React, { useState } from "react";
import { NextPage } from "next";
import { Wrapper } from "../../components/Wrapper";
import { Formik, Form } from "formik";

import { InputField } from "../../components/InputField";
import { Button, Box, Link } from "@chakra-ui/core";
import { useChangePasswordMutation } from "../../generated/graphql";
import { toErrorMap } from "../../utils/toErrorMap";
import { useRouter } from "next/router";
import { withUrqlClient } from "next-urql";
import { createURQLClient } from "../../utils/createURQLClient";
import NextLink from "next/link";

const ChangePassword: NextPage = () => {
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");
  const [, changePassword] = useChangePasswordMutation();
  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ newPassword: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await changePassword({
            newPassword: values.newPassword,
            token:
              typeof router.query.token === "string" ? router.query.token : "",
          });

          if (response.data?.changePassword.errors) {
            const errorMap = toErrorMap(response.data.changePassword.errors);
            if ("token" in errorMap) {
              setTokenError(errorMap.token);
            }
            setErrors(errorMap);
          } else if (response.data?.changePassword.user) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              name="newPassword"
              placeholder="new password"
              label="New Password"
              type="password"
            />
            {!!tokenError && (
              <Box>
                <div style={{ color: "red" }}>Token Error</div>
                <Button>
                  <NextLink href="/forgot-password">
                    <Link>Get New Link</Link>
                  </NextLink>
                </Button>
              </Box>
            )}
            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              Change Password
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createURQLClient, { ssr: false })(ChangePassword);
