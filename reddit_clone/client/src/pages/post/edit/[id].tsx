import { Box, Button } from "@chakra-ui/core";
import { Form, Formik } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React from "react";
import { InputField } from "../../../components/InputField";
import { Layout } from "../../../components/Layout";
import { useUpdatePostMutation } from "../../../generated/graphql";
import { createURQLClient } from "../../../utils/createURQLClient";
import { useGetIntID } from "../../../utils/useGetIntId";
import { useGetPostFromURL } from "../../../utils/useGetPostFromURL";

const EditPost = ({}) => {
  const intId = useGetIntID();
  const router = useRouter();
  const [{ data, error: err, fetching }] = useGetPostFromURL();
  const [, updatePost] = useUpdatePostMutation();

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
    <Layout variant="small">
      <Formik
        initialValues={{ title: data.post.title, text: data.post.text }}
        onSubmit={async (values, {}) => {
          await updatePost({ id: intId, ...values });
          router.back();
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="title" placeholder="title" label="Title" />

            <Box mt={4}>
              <InputField
                textarea
                name="text"
                placeholder="text..."
                label="Body"
              />
            </Box>

            <Button
              mt={4}
              type="submit"
              isLoading={isSubmitting}
              variantColor="teal"
            >
              Edit Post
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default withUrqlClient(createURQLClient)(EditPost);
