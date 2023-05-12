"use client";

import React, { useEffect, useId } from "react";
import { useMapProvider } from "../../context";

export const PinGroup = ({ children }: React.PropsWithChildren) => {
  const pinGroupId = useId();
  const { map } = useMapProvider();

  useEffect(() => {
    if (!map) {
      return;
    }

    const points = React.Children.map(children, (child) => {
      return (child as any).props as { isCompleted: boolean; coordinates: [number, number] };
    });

    if (!points) {
      return;
    }

    if (!map.getSource(pinGroupId)) {
      const geoJson = {
        type: "FeatureCollection",
        features: points.map((point) => {
          return {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: point.coordinates,
            },
            properties: {
              icon: point.isCompleted ? "check" : "cross",
            },
          };
        }),
      };

      map.addSource(pinGroupId, {
        type: "geojson",
        data: geoJson as any,
      });
    }

    if (!map.getLayer(pinGroupId)) {
      map.addLayer({
        id: pinGroupId,
        type: "symbol",
        source: pinGroupId,
        layout: {
          "icon-image": ["get", "icon"],
          "icon-size": 0.75,
          "icon-allow-overlap": true,
        },
      });
    }

    return () => {
      if (!map) {
        return;
      }

      map.removeLayer(pinGroupId);
      map.removeSource(pinGroupId);
    };
  }, [map]);

  return null;
};
