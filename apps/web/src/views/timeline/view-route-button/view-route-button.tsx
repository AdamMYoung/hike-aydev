"use client";

import { lineString } from "@turf/helpers";
import bbox from "@turf/bbox";
import { useEffect, useId } from "react";
import { Button, useInteractionProvider, useMapProvider } from "ui";
import { decode } from "@googlemaps/polyline-codec";
import { useIsMobile } from "@/hooks/use-is-mobile";

type ViewRouteButtonProps = {
  polyline: string;
};

export const ViewRouteButton = ({ polyline }: ViewRouteButtonProps) => {
  const routeId = useId();
  const isMobile = useIsMobile();
  const { map } = useMapProvider();
  const { setIsManual, activeId, setActiveId, setIsMobileMapOpen } = useInteractionProvider();

  const drawRoute = () => {
    if (!map) {
      return;
    }

    const decodedPolyline = decode(polyline);
    const flippedPolyline = decodedPolyline.map((p) => [p[1], p[0]]);

    const linestring = lineString(flippedPolyline);
    const box = bbox(linestring);

    map.fitBounds(
      [
        [box[0], box[1]],
        [box[2], box[3]],
      ],
      { padding: 50, pitch: 60, bearing: 0, duration: 3000 }
    ),
      map.addSource(routeId, {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: flippedPolyline,
          },
        },
      });

    map.addLayer({
      id: routeId,
      type: "line",
      source: routeId,
      layout: { "line-join": "round", "line-cap": "round" },
      paint: { "line-color": "#ff6a00", "line-width": 8 },
    });

    setIsManual(true);

    if (isMobile) {
      setIsMobileMapOpen(true);
    }
  };

  const clearRoute = () => {
    if (!map) {
      return;
    }

    if (map.getLayer(routeId)) {
      map.removeLayer(routeId);
    }

    if (map.getSource(routeId)) {
      map.removeSource(routeId);
    }
  };

  useEffect(() => {
    if (!map) {
      return;
    }

    if (activeId === routeId) {
      drawRoute();
    } else {
      clearRoute();
    }

    return () => {
      clearRoute();
    };
  }, [map, activeId, routeId]);

  const handleClick = () => {
    setActiveId(routeId);
  };

  return (
    <Button onClick={handleClick} variant="outline">
      View Route
    </Button>
  );
};
