"use client";

import { MapInteractionContext, ZoomPointArgs } from "ui";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMapContext } from "ui";
import { usePathname } from "next/navigation";

export const MapInteraction = ({ children }: React.PropsWithChildren) => {
  const pathname = usePathname();

  const [isManualMode, setIsManualMode] = useState(false);
  const { map, animate, isAnimating, isLoaded } = useMapContext();
  const currZoom = useRef<number | undefined>(map?.getView().getZoom());

  useEffect(() => {
    setIsManualMode(false);
  }, [pathname]);

  useEffect(() => {
    if (!isManualMode && !isAnimating) {
      currZoom.current = map?.getView().getZoom();
    }
  }, [isAnimating, map, isManualMode]);

  const handleSetZoomPoint = useCallback(
    ({ coordinates, zoom }: ZoomPointArgs, animation?: boolean) => {
      animate({ center: coordinates, zoom, duration: animation ? 1000 : 0 });

      if (isLoaded) {
        setIsManualMode(true);
      }
    },
    [animate, isLoaded]
  );

  const handleManualDrag = useCallback(() => {
    if (isLoaded) {
      setIsManualMode(true);
    }
  }, [isLoaded]);

  const handleManualZoom = useCallback(() => {
    if (!map || !isLoaded) {
      return;
    }

    var newZoom = map.getView().getZoom();
    if (currZoom.current != newZoom) {
      currZoom.current = newZoom;
      setIsManualMode(true);
    }
  }, [map, isLoaded]);

  useEffect(() => {
    if (map) {
      map?.addEventListener("pointerdrag", handleManualDrag);
      map?.addEventListener("moveend", handleManualZoom);
    }

    return () => {
      map?.removeEventListener("pointerdrag", handleManualDrag);
      map?.removeEventListener("moveend", handleManualZoom);
    };
  }, [map, isAnimating, handleManualZoom, handleManualDrag]);

  return (
    <MapInteractionContext value={{ setZoomPoint: handleSetZoomPoint, isManualMode, setIsManualMode }}>
      {children}
    </MapInteractionContext>
  );
};
