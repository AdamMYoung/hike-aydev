"use client";

import mapboxgl from "mapbox-gl";
import React, { useEffect, useId, useState } from "react";
import { useDarkMode, useInteractionProvider, useMapProvider } from "../../context";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN ?? "";

const DARK_MODE_STYLE_URL = "mapbox://styles/adammyoung97/cljw5kn5e01zn01pjdzem8q75";
const LIGHT_MODE_STYLE_URL = "mapbox://styles/adammyoung97/cli52ud6y02p801pg9fl19of5";

export const Map = ({ children }: React.PropsWithChildren) => {
  const mapId = useId();
  const [isLoaded, setIsLoaded] = useState(false);
  const { setMap } = useMapProvider();
  const { setIsManual } = useInteractionProvider();
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    const styleUrl = isDarkMode ? DARK_MODE_STYLE_URL : LIGHT_MODE_STYLE_URL;

    const _map = new mapboxgl.Map({
      container: mapId, // container ID
      style: styleUrl,
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

      if (!_map.getSource("mapbox-dem")) {
        _map.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,
          maxzoom: 10,
        });

        _map.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
      }
    });

    return () => {
      setMap(undefined);
    };
  }, [isDarkMode]);

  return (
    <div id={mapId} className="w-full h-full relative">
      {isLoaded ? children : null}
    </div>
  );
};
