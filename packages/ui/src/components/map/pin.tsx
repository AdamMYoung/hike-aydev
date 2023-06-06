"use client";

export type PinProps = {
  isCompleted?: boolean;
  coordinates: [number, number];
  name: string;
};

export const Pin = (_: PinProps) => {
  return null;
};

Pin.displayName = "Pin";
