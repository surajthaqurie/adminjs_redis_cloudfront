import React, { FC, ReactElement } from "react";
import { Box, Label } from "@adminjs/design-system";
import ReactQuill from "react-quill";
import { ShowPropertyProps } from "adminjs";

const ShowTextEditor: FC<ShowPropertyProps> = ({ record, property }): ReactElement => {
  const modules = {
    toolbar: false
  };
  return (
    <Box style={{ margin: "4rem 0" }}>
      <Label>{property.label}</Label>
      <ReactQuill style={{ height: "30rem" }} theme="snow" readOnly={true} value={record.params[`${property.path}`]} modules={modules} />
    </Box>
  );
};

export default ShowTextEditor;
