"use client";

import mapboxgl from "mapbox-gl";
import React, { useEffect, useId, useState } from "react";
import { useInteractionProvider, useMapProvider } from "../../context";
import { useInitialLoadStatus } from "../../hooks";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

export const Map = ({ children }: React.PropsWithChildren) => {
  const mapId = useId();
  const [isLoaded, setIsLoaded] = useState(false);
  const { setMap } = useMapProvider();
  const { setIsManual } = useInteractionProvider();

  useEffect(() => {
    const _map = new mapboxgl.Map({
      container: mapId, // container ID
      style: "mapbox://styles/adammyoung97/cli52ud6y02p801pg9fl19of5",
      center: [-2.5478, 54.0039],
      zoom: 6,
    });

    const nav = new mapboxgl.NavigationControl({
      visualizePitch: true,
    });

    _map.loadImage("https://hike.aydev.uk/data/check-circle.png", (error, image) => {
      if (error) throw error;
      if (!image) return;

      _map.addImage("check", image);
    });

    _map.loadImage("https://hike.aydev.uk/data/cross-circle.png", (error, image) => {
      if (error) throw error;
      if (!image) return;

      _map.addImage("cross", image);
    });

    _map.on("mousedown", () => {
      _map.once("move", () => {
        setIsManual(true);
      });
    });

    _map.on("touchstart", () => {
      _map.once("move", () => {
        setIsManual(true);
      });
    });

    _map.on("zoom", (e) => {
      if (e.originalEvent?.isTrusted) {
        setIsManual(true);
      }
    });

    _map.addControl(nav, "top-right");

    _map.on("style.load", () => {
      setIsLoaded(true);
      setMap(_map);

      _map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 10,
      });

      _map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
    });

    return () => {
      setMap(undefined);
    };
  }, []);

  return (
    <div id={mapId} className="w-full h-full relative">
      {isLoaded ? children : null}
    </div>
  );
};
