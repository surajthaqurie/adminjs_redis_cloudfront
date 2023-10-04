import React, { FC, ReactElement } from "react";
import { Navigation } from "@adminjs/design-system";
import { SidebarResourceSectionProps, useNavigationResources } from "adminjs";

const SidebarResourceSection: FC<SidebarResourceSectionProps> = ({ resources }): ReactElement => {
  const elements = useNavigationResources(resources);

  return <Navigation label={""} elements={elements} />;
};

export default SidebarResourceSection;
