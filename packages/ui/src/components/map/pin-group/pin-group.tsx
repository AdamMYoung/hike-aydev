"use client";

import debounce from 'lodash.debounce';
import { Feature } from 'ol';
import { Vector as VectorLayer } from 'ol/layer.js';
import VectorSource from 'ol/source/Vector.js';
import React, { useCallback, useEffect, useRef } from 'react';

import { useMapInteractionContext } from '../../../context';
import { useMapContext } from '../map.context';
import { PinGroupContextProvider } from './pin-group.context';

type PinGroupProps = React.PropsWithChildren & {
  disableAnimation?: boolean;
};

export const PinGroup = React.memo(({ children, disableAnimation }: PinGroupProps) => {
  const { isManualMode } = useMapInteractionContext();
  const vectorSource = useRef(new VectorSource());
  const { map, fit } = useMapContext();

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

      if (disableAnimation || isManualMode) {
        return;
      }

      fit(vectorSource.current.getExtent(), {
        size: map.getSize(),
        maxZoom: 16,
        padding: [100, 100, 100, 100],
        duration: 1000,
      });
    }),
    [map, isManualMode]
  );

  useCallback(() => {
    if (isManualMode) {
      adjustToView();
    }
  }, [isManualMode, adjustToView]);

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
});

PinGroup.displayName = "PinGroup";
