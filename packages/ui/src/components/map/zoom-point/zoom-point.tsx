"use client";

import { useEffect } from "react";
import { useMapContext } from "../map.context";
import { Coordinate } from "ol/coordinate";
import React from "react";
import { useMapInteractionContext } from "../../../context";

type ZoomPointProps = {
  coordinates: Coordinate;
  zoom?: number;
};

export const ZoomPoint = React.memo(({ coordinates, zoom = 6 }: ZoomPointProps) => {
  const { isManualMode } = useMapInteractionContext();
  const { animate } = useMapContext();

  useEffect(() => {
    if (!isManualMode) {
      animate({ center: coordinates, zoom });
    }
  }, [animate, coordinates, isManualMode, zoom]);

  return null;
});

ZoomPoint.displayName = "ZoomPoint";
