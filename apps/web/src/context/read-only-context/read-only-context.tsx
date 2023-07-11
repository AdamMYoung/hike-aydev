"use client";

import { createContext, useContext } from "react";

type ReadOnlyContextOptions = {
  isReadOnly: boolean;
};

type ReadOnlyProviderProps = ReadOnlyContextOptions & React.PropsWithChildren;

export const ReadOnlyContext = createContext<ReadOnlyContextOptions>({ isReadOnly: false });

export const ReadOnlyProvider = ({ children, isReadOnly }: ReadOnlyProviderProps) => {
  return <ReadOnlyContext.Provider value={{ isReadOnly }}>{children}</ReadOnlyContext.Provider>;
};

export const useReadOnly = () => useContext(ReadOnlyContext);
