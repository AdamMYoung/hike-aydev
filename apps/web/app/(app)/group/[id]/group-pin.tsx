"use client";

import React from "react";
import { useGroupInteractionContext, useMapContext } from "ui";
import { Pin } from "ui";

type GroupPinProps = {
  isCompleted: boolean;
  fell: {
    id: number;
    lng: number;
    lat: number;
  };
};

const icons = {
  true: {
    true: "/data/focus-check.svg",
    false: "/data/focus-cross.svg",
  },
  false: {
    true: "/data/check-circle.svg",
    false: "/data/cross-circle.svg",
  },
};

export const GroupPin = React.memo(({ fell, isCompleted, ...rest }: GroupPinProps) => {
  const { focusedFell } = useGroupInteractionContext();

  const src = icons[`${focusedFell === fell.id}`][`${isCompleted}`];
  return <Pin {...rest} coordinates={[fell.lng, fell.lat]} iconSrc={src} />;
});

GroupPin.displayName = "GroupPin";
