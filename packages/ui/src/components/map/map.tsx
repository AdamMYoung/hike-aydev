"use client";

import { cn, ElementProps } from "../../lib";
import OLMap from "ol/Map.js";
import OSM from "ol/source/OSM.js";
import TileLayer from "ol/layer/Tile.js";
import View from "ol/View.js";
import { useEffect, useState } from "react";
import { MapContextProvider } from "./map.context";

export type MapProps = ElementProps<"div"> & {};

export const Map = ({ children, className, ...rest }: ElementProps<"div">) => {
  const _className = cn("w-full h-full", className);
  const [element, setElement] = useState<HTMLDivElement | null>(null);
  const [map, setMap] = useState<OLMap | null>(null);

  useEffect(() => {
    if (element && !map) {
      setMap(
        new OLMap({
          target: element,
          layers: [
            new TileLayer({
              source: new OSM(),
            }),
          ],
          view: new View({
            center: [0, 0],
            zoom: 2,
          }),
        })
      );
    }
  }, [element, map]);

  return (
    <div className={_className} ref={setElement} {...rest}>
      <MapContextProvider value={{ map }}>{children}</MapContextProvider>
    </div>
  );
};
