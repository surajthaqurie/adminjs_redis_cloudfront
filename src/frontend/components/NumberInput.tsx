import React, { useState, FC, ReactElement } from "react";
import { Box, Label, FormGroup, Input } from "@adminjs/design-system";
import { ShowPropertyProps } from "adminjs";
import { requiredField, errorColor, margin } from "../styles";

const NumberInput: FC<ShowPropertyProps> = (props): ReactElement => {
  const { property, record } = props;
  const [numberValue, setNumberValue] = useState(record.params[`${property.path}`] ? record.params[`${property.path}`] : "");
  const error = record.errors && record.errors[property.path];

  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setNumberValue(e.target.value);
    record.params[`${property.path}`] = e.target.value;
  };

  return (
    <Box style={margin(-0.5, 0, 2, 0, "rem")}>
      <FormGroup error={Boolean(error)}>
        <Label>
          {property.path !== "orders" && <span style={error ? errorColor : requiredField}>* </span>}
          {property.label}
        </Label>
        <Input width={1} type="number" min="0" name={property.label} oninput="validity.valid||(value='');" value={numberValue} onChange={changeHandler} />
      </FormGroup>
      <Label style={{ ...errorColor, marginTop: "-0.5rem" }}>{error?.message}</Label>
    </Box>
  );
};

export default NumberInput;
