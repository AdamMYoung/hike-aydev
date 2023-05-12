"use client";

import { useCallback } from "react";
import { Button, ElementProps, useInteractionProvider } from "ui";

export const ResetViewButton = ({ children, ...rest }: ElementProps<typeof Button>) => {
  const { isManual, setIsManual } = useInteractionProvider();

  const handleClick = useCallback(() => {
    setIsManual(false);
  }, [setIsManual]);

  if (!isManual) {
    return null;
  }

  return (
    <Button className="z-20" onClick={handleClick} {...rest}>
      {children}
    </Button>
  );
};
