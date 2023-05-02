import React, { useEffect, useRef } from "react";
import VectorSource from "ol/source/Vector.js";
import { Vector as VectorLayer } from "ol/layer.js";
import { useMapContext } from "../map.context";
import { PinGroupContextProvider } from "./pin-group.context";

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

  return <PinGroupContextProvider value={{ layer: vectorSource.current }}>{children}</PinGroupContextProvider>;
};
