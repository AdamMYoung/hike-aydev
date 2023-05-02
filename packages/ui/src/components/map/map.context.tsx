import OLMap from "ol/Map";
import { createContext } from "../../lib";

type MapContextOptions = {
  map: OLMap | null;
};

export const [MapContextProvider, useMapContext] = createContext<MapContextOptions>();
