"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { List, Map as MapIcon, RefreshCw } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { Button, cn, Map, useInitialLoadStatus, useInteractionProvider } from "ui";
import { ResetViewButton } from "../reset-view-button";

const blacklistRoutes = ["/profile"];

export const MobileMap = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const { isMobileMapOpen, setIsMobileMapOpen } = useInteractionProvider();
  const isLoaded = useInitialLoadStatus();

  useEffect(() => {
    if (!isMobile) {
      setIsMobileMapOpen(false);
    }
  }, [isMobile]);

  if (pathname && blacklistRoutes.includes(pathname)) {
    return null;
  }

  return (
    <>
      <div className="absolute z-20 bottom-0 right-0 left-0 p-4 w-full flex justify-center md:hidden pointer-events-none">
        <Button
          onClick={() => setIsMobileMapOpen(!isMobileMapOpen)}
          className="rounded-full w-auto p-8 pointer-events-auto"
        >
          {isMobileMapOpen ? <List /> : <MapIcon />}
        </Button>
      </div>
      {isMobileMapOpen ? (
        <div className="z-20 absolute bottom-4 left-4 pointer-events-none">
          <ResetViewButton className="p-8 rounded-full pointer-events-auto">
            <RefreshCw />
          </ResetViewButton>
        </div>
      ) : null}
      {isLoaded ? (
        <div
          className={cn(
            "absolute transition-opacity bg-background z-10 top-0 left-0 bottom-0 right-0",
            isMobileMapOpen ? "opacity-100" : "pointer-events-none opacity-0"
          )}
        >
          {isMobile ? <Map>{children}</Map> : null}
        </div>
      ) : null}
    </>
  );
};
