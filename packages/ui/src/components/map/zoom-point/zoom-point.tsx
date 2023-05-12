"use client";

import { useEffect } from "react";
import { useMapContext } from "../map.context";
import { Coordinate } from "ol/coordinate";

type ZoomPointProps = {
  coordinates: Coordinate;
  zoom?: number;
};

export const ZoomPoint = ({ coordinates, zoom = 6 }: ZoomPointProps) => {
  const { animate } = useMapContext();

  useEffect(() => {
    animate({ center: coordinates, zoom });
  }, [animate, coordinates, zoom]);

  return null;
};
