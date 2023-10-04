import React, { FC, ReactElement } from "react";
import { Box } from "@adminjs/design-system";
import AdminJS from "adminjs";

const SidebarFooter: FC = (): ReactElement => {
  const adminJS = AdminJS as any;
  const APP_NAME = adminJS.env.APP_NAME;

  const current_year = new Date().getFullYear();

  return (
    <Box mt="lg" mb="md" style={{ marginLeft: "30px" }} data-css="sidebar-footer">
      Copyright &copy; {current_year} {APP_NAME}
    </Box>
  );
};

export default SidebarFooter;
