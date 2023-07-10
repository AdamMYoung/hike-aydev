import React from "react";
import { ScrollArea } from "ui";

type SideNavigationProps = React.PropsWithChildren & {};

export const SideNavigation = ({ children }: SideNavigationProps) => {
  return <ScrollArea className="relative h-full">{children}</ScrollArea>;
};
