import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Box, H5, Label, Input, FormGroup, Button, Text, MessageBox } from "@adminjs/design-system";
import { useTranslation } from "adminjs";
import { useSelector } from "react-redux";

const GlobalStyle = createGlobalStyle`
  html, body, #app {
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
  }
`;

const Wrapper = styled(Box)`
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
`;

const StyledLogo = styled.img`
  max-width: 40%;
`;

export type LoginProps = {
  message?: string;
  action: string;
};

export const Login: React.FC<any> = (props) => {
  const { action, message } = props;
  const APP_NAME = process.env.APP_NAME;

  const current_year = new Date().getFullYear();

  let new_message = message;
  if (new_message === "invalidCredentials") {
    new_message = "Wrong email and/or password or 2FA token";
  }
  const { translateButton, translateProperty } = useTranslation();
  const branding = useSelector((state: any) => state.branding);

  return (
    <>
      <GlobalStyle />
      <Wrapper flex variant="grey">
        <Box bg="white" flex boxShadow="login" width={[1, 2 / 3, "auto"]}>
          <Box as="form" action={action} method="POST" p="x3" flexGrow={1} width={["100%", "100%", "480px"]}>
            <H5 style={{ textAlign: "center" }}>{branding.logo ? <StyledLogo src={branding.logo} alt={branding.companyName} /> : branding.companyName}</H5>
            {message === "invalidCredentials" && <MessageBox my="lg" message={message.split(" ").length > 1 ? new_message : new_message} variant="danger" />}
            <FormGroup>
              <Label required>{translateProperty("email")}</Label>
              <Input name="email" placeholder={translateProperty("email")} />
            </FormGroup>
            <FormGroup>
              <Label required>{translateProperty("password")}</Label>
              <Input type="password" name="password" placeholder={translateProperty("password")} autoComplete="new-password" />
            </FormGroup>
            <FormGroup>
              <Label>
                {translateProperty("2FA Token")} <small style={{ color: "red" }}>(Note: If you have enable Two FA, then only this field is required)</small>
              </Label>
              <Input name="two_fa_token" placeholder={translateProperty("2FA Token")} />
            </FormGroup>
            <Text mt="xl" textAlign="center">
              <Button variant="primary">{translateButton("login")}</Button>
            </Text>
          </Box>
        </Box>
        <Box mt="xxl">
          Copyright &copy; {current_year} {APP_NAME}
        </Box>
      </Wrapper>
    </>
  );
};

export default Login;
