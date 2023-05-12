"use client";

import { GroupInteractionContext } from "ui";
import debounce from "lodash.debounce";
import React, { useCallback, useState } from "react";

export const GroupInteraction = ({ children }: React.PropsWithChildren) => {
  const [focusedFell, setFocusedFell] = useState<number | null>(null);

  const handleSetFocusedFell = useCallback(
    debounce((fell) => {
      setFocusedFell(fell);
    }, 20),
    []
  );

  return (
    <GroupInteractionContext value={{ focusedFell, setFocusedFell: handleSetFocusedFell }}>
      {children}
    </GroupInteractionContext>
  );
};
