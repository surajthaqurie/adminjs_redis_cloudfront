import React, { FC, ReactElement } from "react";
import { H2 } from "@adminjs/design-system";
import AdminJS from "adminjs";

const Dashboard: FC = (): ReactElement => {
  const adminJS = AdminJS as any;

  return <H2>{adminJS.env.APP_NAME}</H2>;
};

export default Dashboard;
