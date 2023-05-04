"use client";

import React, { useCallback, useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { useMapContext } from "../map.context";
import { PinGroupContextProvider } from "./pin-group.context";
import { Feature } from "ol";

export const PinGroup = ({ children }: React.PropsWithChildren) => {
  const vectorSource = useRef(new VectorSource());
  const { map } = useMapContext();

  useEffect(() => {
    if (!map) {
      return;
    }

    const vectorLayer = new VectorLayer({
      source: vectorSource.current,
    });

    map.addLayer(vectorLayer);

    return () => {
      map.removeLayer(vectorLayer);
    };
  }, [map]);

  const addFeature = useCallback(
    (feature: Feature) => {
      if (!map) {
        return;
      }

      vectorSource.current.addFeature(feature);

      map.getView().fit(vectorSource.current.getExtent(), {
        size: map.getSize(),
        maxZoom: 16,
        padding: [100, 100, 100, 100],
      });
    },
    [map]
  );

  const removeFeature = useCallback((feature: Feature) => {
    vectorSource.current.removeFeature(feature);
  }, []);

  return (
    <PinGroupContextProvider value={{ layer: vectorSource.current, addFeature, removeFeature }}>
      {children}
    </PinGroupContextProvider>
  );
};
