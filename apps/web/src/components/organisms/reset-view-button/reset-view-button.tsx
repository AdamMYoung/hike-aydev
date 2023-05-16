"use client";

import { useCallback } from "react";
import { Button, ElementProps, useMapInteractionContext } from "ui";

export const ResetViewButton = ({ children, ...rest }: ElementProps<typeof Button>) => {
  const { isManualMode, setIsManualMode } = useMapInteractionContext();

  const handleClick = useCallback(() => {
    setIsManualMode(false);
  }, [setIsManualMode]);

  if (!isManualMode) {
    return null;
  }

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};
