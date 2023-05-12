"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { Map } from "ui";

export const DesktopMap = ({ children }: React.PropsWithChildren) => {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return <Map>{children}</Map>;
  }

  return null;
};
