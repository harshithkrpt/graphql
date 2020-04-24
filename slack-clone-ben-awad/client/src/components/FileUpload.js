import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import gql from "graphql-tag";
import { useMutation } from "@apollo/react-hooks";

const CREATE_FILE_MSG_MUTATION = gql`
  mutation($channelId: Int!, $file: File) {
    createMessage(channelId: $channelId, file: $file)
  }
`;

const FileUpload = ({ children, disableClicking, channelId, style = {} }) => {
  const [createMessage] = useMutation(CREATE_FILE_MSG_MUTATION);
  const onDrop = useCallback(
    async ([file]) => {
      await createMessage({
        variables: {
          channelId,
          file,
        },
      });
    },
    [createMessage, channelId]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: disableClicking,
  });
  return (
    <div {...getRootProps()} style={style}>
      <input {...getInputProps()} />
      {children}
    </div>
  );
};

export default FileUpload;
