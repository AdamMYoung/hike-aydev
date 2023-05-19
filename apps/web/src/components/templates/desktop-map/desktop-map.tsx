"use client";

import { Map } from "ui";
import useBreakpoint from "use-breakpoint";

const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };

export const DesktopMap = ({ children }: React.PropsWithChildren) => {
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "desktop");

  if (breakpoint !== "mobile") {
    return <Map>{children}</Map>;
  }

  return null;
};
