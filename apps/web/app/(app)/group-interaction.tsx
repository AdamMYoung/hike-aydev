"use client";

import { GroupInteractionContext } from "ui";

import React, { useState } from "react";

export const GroupInteraction = ({ children }: React.PropsWithChildren) => {
  const [focusedFell, setFocusedFell] = useState<number | null>(null);

  return <GroupInteractionContext value={{ focusedFell, setFocusedFell }}>{children}</GroupInteractionContext>;
};
