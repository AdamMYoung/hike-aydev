"use client";

import { ResetViewButton } from "@views/shared/reset-view-button";
import { List, Map as MapIcon, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, cn, Map, useInitialLoadStatus } from "ui";
import useBreakpoint from "use-breakpoint";

const BREAKPOINTS = { mobile: 0, tablet: 768, desktop: 1280 };

const blacklistRoutes = ["/profile", "/data"];

export const MobileMap = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();
  const { breakpoint } = useBreakpoint(BREAKPOINTS, "desktop");
  const [isOpen, setIsOpen] = useState(false);
  const isLoaded = useInitialLoadStatus();

  useEffect(() => {
    if (breakpoint !== "mobile") {
      setIsOpen(false);
    }
  }, [breakpoint]);

  if (pathname && blacklistRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <div className="absolute z-20 bottom-0 right-0 left-0 p-4 w-full flex justify-center md:hidden pointer-events-none">
        <Button onClick={() => setIsOpen((open) => !open)} className="rounded-full w-auto p-8 pointer-events-auto">
          {isOpen ? <List /> : <MapIcon />}
        </Button>
      </div>
      {isOpen ? (
        <div className="z-20 absolute bottom-4 left-4 pointer-events-none">
          <ResetViewButton className="p-8 rounded-full pointer-events-auto">
            <RefreshCw />
          </ResetViewButton>
        </div>
      ) : null}
      {isLoaded ? (
        <div
          className={cn(
            "absolute transition-opacity bg-white z-10 top-0 left-0 bottom-0 right-0",
            isOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          {breakpoint === "mobile" ? <Map>{children}</Map> : null}
        </div>
      ) : null}
    </>
  );
};
