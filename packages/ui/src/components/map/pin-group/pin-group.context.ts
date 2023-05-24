import { Feature } from 'ol';
import { Geometry } from 'ol/geom';
import VectorSource from 'ol/source/Vector';

import { createContext } from '../../../lib';

export type PinGroupContextOptions = {
  layer: VectorSource<Geometry>;
  addFeature: (feature: Feature) => void;
  removeFeature: (feature: Feature) => void;
};

export const [PinGroupContextProvider, usePinGroupContext] = createContext<PinGroupContextOptions>();
