"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type DarkModeContextOptions = {
  isDarkMode: boolean;
  setDarkMode: (isDarkMode: boolean) => void;
};

export const DarkModeContext = createContext<DarkModeContextOptions>({ isDarkMode: false, setDarkMode: () => {} });

export const DarkModeProvider = ({ children }: React.PropsWithChildren) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    setIsDarkMode(localStorage?.theme === "dark");
  }, []);

  const setDarkMode = (isDarkMode: boolean) => {
    if (isDarkMode) {
      localStorage.theme = "dark";
      document.documentElement.classList.add("dark");
    } else {
      localStorage.theme = "light";
      document.documentElement.classList.remove("dark");
    }

    setIsDarkMode(isDarkMode);
  };

  return <DarkModeContext.Provider value={{ isDarkMode, setDarkMode }}>{children}</DarkModeContext.Provider>;
};

export const useDarkMode = () => useContext(DarkModeContext);
