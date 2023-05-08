"use client";

import React, { useCallback, useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { useMapContext } from "../map.context";
import { PinGroupContextProvider } from "./pin-group.context";
import { Feature } from "ol";
import debounce from "lodash.debounce";

type PinGroupProps = React.PropsWithChildren & {
  disableAnimation?: boolean;
};

export const PinGroup = ({ children, disableAnimation }: PinGroupProps) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const adjustToView = useCallback(
    debounce(() => {
      if (!map) {
        return;
      }

      if (disableAnimation) {
        return;
      }

      map.getView().fit(vectorSource.current.getExtent(), {
        size: map.getSize(),
        maxZoom: 16,
        padding: [100, 100, 100, 100],
        duration: 1500,
      });
    }),
    [map]
  );

  const addFeature = useCallback(
    (feature: Feature) => {
      if (!map) {
        return;
      }

      vectorSource.current.addFeature(feature);
      adjustToView();
    },
    [map, adjustToView]
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
