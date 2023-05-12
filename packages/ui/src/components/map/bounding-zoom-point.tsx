"use client";

import React, { useEffect } from "react";
import bbox from "@turf/bbox";
import { lineString } from "@turf/helpers";
import { useInteractionProvider, useMapProvider } from "../../context";

type BoundingZoomPointProps = {
  points: [number, number][];
  zoom?: number;
};

export const BoundingZoomPoint = React.memo(({ points, zoom = 6 }: BoundingZoomPointProps) => {
  const { isManual } = useInteractionProvider();
  const { map } = useMapProvider();

  useEffect(() => {
    if (map && !isManual) {
      const line = lineString(points);
      const box = bbox(line);

      map.fitBounds(
        [
          [box[0], box[1]],
          [box[2], box[3]],
        ],
        { padding: 20, pitch: 0, bearing: 0, duration: 3000 }
      );
    }
  }, [points, zoom, map, isManual]);

  return null;
});

BoundingZoomPoint.displayName = "ZoomPoint";
