"use client";

import React from 'react';
import { Pin } from 'ui';

type GroupPinProps = {
  isCompleted: boolean;
  fell: {
    id: number;
    lng: number;
    lat: number;
  };
};

export const GroupPin = React.memo(({ fell, isCompleted, ...rest }: GroupPinProps) => {
  const src = isCompleted ? "/data/check-circle.svg" : "/data/cross-circle.svg";
  return <Pin {...rest} coordinates={[fell.lng, fell.lat]} iconSrc={src} />;
});

GroupPin.displayName = "GroupPin";
