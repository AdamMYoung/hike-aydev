"use client";

import React, { useEffect, useState } from 'react';

import { cn, ElementProps } from '../../lib';
import { useMapContext } from './map.context';

export type MapProps = ElementProps<"div"> & {};

export const Map = React.memo(({ children, className, ...rest }: ElementProps<"div">) => {
  const _className = cn("w-full h-full", className);
  const { map } = useMapContext();
  const [isMapAssigned, setIsMapAssigned] = useState(false);
  const [element, setElement] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    if (element && map) {
      setIsMapAssigned(true);
      map?.setTarget(element);
    }
  }, [element, map, isMapAssigned]);

  return (
    <div className={_className} ref={setElement} {...rest}>
      {children}
    </div>
  );
});

Map.displayName = "Map";
