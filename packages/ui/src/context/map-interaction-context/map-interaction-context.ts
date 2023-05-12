"use client";

import { createContext } from "../../lib/context";
import { Coordinate } from "ol/coordinate";

export type ZoomPointArgs = { coordinates: Coordinate; zoom: number };

type MapInteractionContextOptions = {
  isManualMode: boolean;

  setZoomPoint: (options: ZoomPointArgs, animation?: boolean) => void;
  setIsManualMode: (isManualMode: boolean) => void;
};

export const [MapInteractionContext, useMapInteractionContext] = createContext<MapInteractionContextOptions>();
