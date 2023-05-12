"use client";

import { useEffect } from "react";
import { useMapContext } from "../map.context";
import { Coordinate } from "ol/coordinate";
import React from "react";

type ZoomPointProps = {
  coordinates: Coordinate;
  zoom?: number;
};

export const ZoomPoint = React.memo(({ coordinates, zoom = 6 }: ZoomPointProps) => {
  const { animate } = useMapContext();

  useEffect(() => {
    animate({ center: coordinates, zoom });
  }, [animate, coordinates, zoom]);

  return null;
});

ZoomPoint.displayName = "ZoomPoint";
