import React, { useState, ReactElement, FC } from "react";
import ReactQuill from "react-quill";
import { Box, FormGroup, Label } from "@adminjs/design-system";
import { requiredField, errorColor } from "../styles";
import { ShowPropertyProps } from "adminjs";

const TextEditor: FC<ShowPropertyProps> = (props): ReactElement => {
  const { property, record } = props;
  const [value, setValue] = useState(record.params[`${property.path}`] ? record.params[`${property.path}`] : "");

  const error = record.errors && record.errors[property.path];

  const modules = {
    toolbar: [
      [{ size: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      [{ script: "super" }, { script: "sub" }],
      [{ header: "1" }, { header: "2" }, "blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ direction: "rtl" }, { align: [] }],
      ["link", "image", "video", "formula"],
      ["clean"]
    ]
  };

  const onChangeHandler = (value: string): void => {
    setValue(value);
  };

  record.params[`${property.path}`] = value.replace(/ style="[^"]*"/g, "");

  return (
    <Box style={error ? { margin: "2rem 0 1.5rem 0" } : { margin: "2rem 0 5rem 0" }}>
      <FormGroup error={Boolean(error)}>
        <Label>
          {property.path === "description" && <span style={error ? errorColor : requiredField}>* </span>}
          {property.label}
        </Label>
        <ReactQuill style={{ height: "35rem" }} theme="snow" value={value} onChange={onChangeHandler} modules={modules} />
      </FormGroup>
      <Label style={{ ...errorColor, marginTop: "3rem" }}>{error?.message}</Label>
    </Box>
  );
};
export default TextEditor;
