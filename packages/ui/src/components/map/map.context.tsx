"use client";

import { Extent } from "ol/extent";
import { SimpleGeometry } from "ol/geom";
import TileLayer from "ol/layer/Tile";
import OLMap from "ol/Map";
import OSM from "ol/source/OSM";
import { AnimationOptions, FitOptions } from "ol/View";
import React, { useState, useEffect, useCallback } from "react";
import { createContext } from "../../lib";

type MapContextOptions = {
  map: OLMap | null;
  isAnimating: boolean;
  animate: (...args: (AnimationOptions | ((arg0: boolean) => void))[]) => void;
  fit: (geometryOrExtent: Extent | SimpleGeometry, options?: FitOptions | undefined) => void;
};

const [MapContextProvider, useMapContext] = createContext<MapContextOptions>();

export { MapContextProvider, useMapContext };

export const MapProvider = ({ children }: React.PropsWithChildren) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [map, setMap] = useState<OLMap | null>(null);

  const animate = useCallback(
    (...args: (AnimationOptions | ((arg0: boolean) => void))[]) => {
      if (map) {
        const view = map.getView();

        setIsAnimating(true);
        view.animate(...args, () => {
          setIsAnimating(false);
        });
      }
    },
    [map]
  );

  const fit = useCallback(
    (geometryOrExtent: Extent | SimpleGeometry, options?: FitOptions | undefined) => {
      if (map) {
        const view = map.getView();

        setIsAnimating(true);
        view.fit(geometryOrExtent, { ...options, callback: () => setIsAnimating(false) });
      }
    },
    [map]
  );

  useEffect(() => {
    if (!map) {
      setMap(
        new OLMap({
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
        })
      );
    }
  }, [map]);

  return <MapContextProvider value={{ map, animate, fit, isAnimating }}>{children}</MapContextProvider>;
};
