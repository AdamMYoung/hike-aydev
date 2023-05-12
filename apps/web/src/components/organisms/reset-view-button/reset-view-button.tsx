"use client";

import { useCallback } from "react";
import { Button, ElementProps, useGroupInteractionContext, useMapInteractionContext } from "ui";

export const ResetViewButton = ({ children, ...rest }: ElementProps<typeof Button>) => {
  const { isManualMode, setIsManualMode } = useMapInteractionContext();
  const { setFocusedFell } = useGroupInteractionContext();

  const handleClick = useCallback(() => {
    setIsManualMode(false);
    setFocusedFell(null);
  }, [setFocusedFell, setIsManualMode]);

  if (!isManualMode) {
    return null;
  }

  return (
    <Button onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};
