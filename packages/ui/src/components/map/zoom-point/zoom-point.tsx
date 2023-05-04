"use client";

import { useEffect } from "react";
import { useMapContext } from "../map.context";
import { Coordinate } from "ol/coordinate";

type ZoomPointProps = {
  coordinates: Coordinate;
  zoom?: number;
};

export const ZoomPoint = ({ coordinates, zoom = 6 }: ZoomPointProps) => {
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) {
      return;
    }

    const view = map.getView();

    view.animate({ center: coordinates, zoom });
  }, [map, coordinates, zoom]);

  return null;
};
