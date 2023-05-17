import React from "react";

type SideNavigationProps = React.PropsWithChildren & {};

export const SideNavigation = ({ children }: SideNavigationProps) => {
  return <div className="relative h-full overflow-y-auto">{children}</div>;
};
