"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type InteractionContextOptions = {
  isManual: boolean;
  activeId?: string;
  isMobileMapOpen: boolean;
  setIsManual: (isManual: boolean) => void;
  setActiveId: (id: string) => void;
  setIsMobileMapOpen: (isOpen: boolean) => void;
};

const InteractionContext = createContext<InteractionContextOptions>({
  isManual: false,
  isMobileMapOpen: false,
  setIsManual: () => {},
  setActiveId: () => {},
  setIsMobileMapOpen: () => {},
});

export const InteractionProvider = ({ children }: React.PropsWithChildren) => {
  const [isManual, setIsManual] = useState<boolean>(false);
  const [isMobileMapOpen, setIsMobileMapOpen] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    if (!isManual) {
      setActiveId(undefined);
    }
  }, [isManual]);

  return (
    <InteractionContext.Provider
      value={{ isManual, activeId, isMobileMapOpen, setIsMobileMapOpen, setIsManual, setActiveId }}
    >
      {children}
    </InteractionContext.Provider>
  );
};

export const useInteractionProvider = () => useContext(InteractionContext);
