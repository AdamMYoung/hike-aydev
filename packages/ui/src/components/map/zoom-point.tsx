"use client";

import React, { useEffect } from "react";
import { useInteractionProvider, useMapProvider } from "../../context";

type ZoomPointProps = {
  coordinates: [number, number];
  zoom?: number;
};

export const ZoomPoint = React.memo(({ coordinates, zoom = 6 }: ZoomPointProps) => {
  const { isManual } = useInteractionProvider();
  const { map } = useMapProvider();

  useEffect(() => {
    if (map && !isManual) {
      map.easeTo({
        center: coordinates,
        pitch: 0,
        bearing: 0,
        zoom,
        duration: 3000,
      });
    }
  }, [coordinates, zoom, map, isManual]);

  return null;
});

ZoomPoint.displayName = "ZoomPoint";
