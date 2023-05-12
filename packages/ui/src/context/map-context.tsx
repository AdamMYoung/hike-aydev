"use client";

import mapboxgl from "mapbox-gl";
import React, { createContext, useContext, useState } from "react";
import { InteractionProvider } from "./interaction-context";

export type MapContextOptions = {
  map?: mapboxgl.Map;
  setMap: (map?: mapboxgl.Map) => void;
};

const MapContext = createContext<MapContextOptions>({ setMap: () => {} });

export const MapProvider = ({ children }: React.PropsWithChildren) => {
  const [map, setMap] = useState<mapboxgl.Map>();

  return (
    <MapContext.Provider value={{ map, setMap }}>
      <InteractionProvider>{children}</InteractionProvider>
    </MapContext.Provider>
  );
};

export const useMapProvider = () => useContext(MapContext);
