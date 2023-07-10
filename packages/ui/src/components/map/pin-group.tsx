"use client";

import React, { useEffect, useId } from "react";
import { useDarkMode, useMapProvider } from "../../context";
import { PinProps } from "./pin";

export const PinGroup = ({ children }: React.PropsWithChildren) => {
  const pinGroupId = useId();
  const { map } = useMapProvider();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    if (!map) {
      return;
    }

    const points = React.Children.map(children, (child) => {
      return (child as any).props as PinProps;
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
              name: point.name,
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
        paint: {
          "text-color": isDarkMode ? "white" : "black",
        },
        layout: {
          "text-field": ["get", "name"],
          "text-variable-anchor": ["top"],
          "text-size": 12,
          "text-radial-offset": 1,
          "text-optional": true,
          "text-justify": "auto",
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

      if (map.getLayer(pinGroupId)) {
        try {
          map.removeLayer(pinGroupId);
        } catch {}
      }

      if (map.getSource(pinGroupId)) {
        try {
          map.removeSource(pinGroupId);
        } catch {}
      }
    };
  }, [map, isDarkMode]);

  return null;
};
