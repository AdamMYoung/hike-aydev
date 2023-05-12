"use client";

import { createContext } from "../../lib/context";

type GroupInteractionContextOptions = {
  focusedFell: number | null;
  setFocusedFell: (id: number | null) => void;
};

export const [GroupInteractionContext, useGroupInteractionContext] = createContext<GroupInteractionContextOptions>();
