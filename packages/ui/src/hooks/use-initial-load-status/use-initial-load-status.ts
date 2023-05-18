"use client";

import { useEffect, useState } from "react";

export const useInitialLoadStatus = () => {
  const [isInitiallyLoaded, setIsInitiallyLoaded] = useState(false);

  useEffect(() => {
    setIsInitiallyLoaded(true);
  }, []);

  return isInitiallyLoaded;
};
