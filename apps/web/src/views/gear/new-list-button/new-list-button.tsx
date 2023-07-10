"use client";

import { createNewGearList } from "@libs/actions";
import { useTransition } from "react";
import { Button } from "ui";

type NewListButtonProps = {
  userId: string | null;
};

export const NewListButton = ({ userId }: NewListButtonProps) => {
  const [isTransitioning, startTransition] = useTransition();

  return (
    <Button
      disabled={isTransitioning}
      onClick={() =>
        startTransition(() => {
          createNewGearList(userId);
        })
      }
    >
      New List
    </Button>
  );
};
