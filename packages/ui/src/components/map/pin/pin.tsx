"use client";

import { Coordinate } from 'ol/coordinate';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import { Icon, Style } from 'ol/style.js';
import React, { useEffect } from 'react';

import { toOSMCoordinates } from '../../../lib';
import { useMapContext } from '../map.context';
import { usePinGroupContext } from '../pin-group/pin-group.context';

type PinProps = {
  iconSrc: string;
  coordinates: Coordinate;
};

export const Pin = React.memo(({ coordinates, iconSrc }: PinProps) => {
  const { map } = useMapContext();
  const { addFeature, removeFeature } = usePinGroupContext();

  useEffect(() => {
    if (!map) {
      return;
    }

    const iconFeature = new Feature({
      geometry: new Point(toOSMCoordinates(coordinates)),
    });

    const iconStyle = new Style({
      image: new Icon({
        scale: 0.8,
        src: iconSrc,
      }),
    });

    iconFeature.setStyle(iconStyle);
    addFeature(iconFeature);

    return () => {
      removeFeature(iconFeature);
    };
  }, [map, addFeature, removeFeature, coordinates, iconSrc]);

  return null;
});

Pin.displayName = "Pin";
