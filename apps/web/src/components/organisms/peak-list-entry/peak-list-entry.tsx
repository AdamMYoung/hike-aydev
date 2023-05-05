"use client";

import { setFellStatus } from "@/libs/actions";
import { Fell } from "database";
import Link from "next/link";
import { useTransition } from "react";
import { Button, Checkbox, cn, ElementProps } from "ui";

type PeakListEntryProps = ElementProps<"div"> & {
  fell: Fell;
  disabled: boolean;
  checked: boolean;
  userId: string | null;
  fellGroupId: number;
};

export const PeakListEntry = ({
  fell,
  disabled,
  checked,
  className,
  userId,
  fellGroupId,
  ...rest
}: PeakListEntryProps) => {
  const [isPending, startTransition] = useTransition();

  const _className = cn("flex group py-1 items-center justify-between", className);

  return (
    <div className={_className} {...rest}>
      <div className="flex gap-2 items-center">
        <Checkbox
          disabled={disabled || isPending}
          checked={checked}
          // @ts-ignore
          onClick={() => startTransition(() => setFellStatus(fell, fellGroupId, userId, !checked))}
          className="h-6 w-6 border-gray-400"
        />
        <label>
          {fell.name} ({fell.metres}m)
        </label>
      </div>
      <Link legacyBehavior href={`/entry/${fell.id}`}>
        <Button
          disabled
          className="font-light transition-opacity group-hover:opacity-100 md:opacity-20"
          variant="ghost"
        >
          View
        </Button>
      </Link>
    </div>
  );
};
