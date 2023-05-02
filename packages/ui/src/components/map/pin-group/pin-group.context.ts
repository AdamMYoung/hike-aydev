import { Geometry } from "ol/geom";
import VectorSource from "ol/source/Vector";
import { createContext } from "../../../lib";

export type PinGroupContextOptions = {
  layer: VectorSource<Geometry>;
};

export const [PinGroupContextProvider, usePinGroupContext] = createContext<PinGroupContextOptions>();
