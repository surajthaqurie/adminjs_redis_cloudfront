import { ComponentLoader } from "adminjs";
export const componentLoader = new ComponentLoader();

export const Components = {
  Dashboard: componentLoader.add("Dashboard", "./Dashboard"),
  TextEditor: componentLoader.add("TextEditor", "./TextEditor"),
  ShowTextEditor: componentLoader.add("ShowTextEditor", "./ShowTextEditor"),
  NumberInput: componentLoader.add("NumberInput", "./NumberInput")
};

export const OverridableComponent = {
  SidebarResourceSection: componentLoader.override(
    "SidebarResourceSection",
    "./overridable/SidebarResourceSection"
  ),
  SidebarFooter: componentLoader.override(
    "SidebarFooter",
    "./overridable/SidebarFooter"
  )
};
