import React from "react";
import { ElementProps, cn } from "ui";

export const SideNavigation = ({ children, className, ...rest }: ElementProps<"div">) => {
  const _className = cn("relative h-full overflow-y-auto", className);

  return <div className={_className}>{children}</div>;
};
