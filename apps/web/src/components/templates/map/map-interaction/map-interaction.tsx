"use client";

import { MapInteractionContext, ZoomPointArgs } from "ui";
import React, { useCallback, useEffect, useState } from "react";
import { useMapContext } from "ui";
import { usePathname } from "next/navigation";

export const MapInteraction = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();
  const [isManualMode, setIsManualMode] = useState(false);
  const { map, animate, isAnimating } = useMapContext();

  useEffect(() => {
    setIsManualMode(false);
  }, [pathname]);

  const handleSetZoomPoint = useCallback(
    ({ coordinates, zoom }: ZoomPointArgs, animation?: boolean) => {
      animate({ center: coordinates, zoom, duration: animation ? 1000 : 0 });

      setIsManualMode(true);
    },
    [animate]
  );

  const handleManualDrag = useCallback(() => {
    setIsManualMode(true);
  }, []);

  useEffect(() => {
    if (map) {
      map?.addEventListener("pointerdrag", handleManualDrag);
    }

    return () => {
      map?.removeEventListener("pointerdrag", handleManualDrag);
    };
  }, [map, isAnimating, handleManualDrag]);

  return (
    <MapInteractionContext value={{ setZoomPoint: handleSetZoomPoint, isManualMode, setIsManualMode }}>
      {children}
    </MapInteractionContext>
  );
};
