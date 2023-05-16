"use client";

import { useMapInteractionContext } from "ui";
import { setFellStatus } from "@/libs/actions";
import { Locate } from "lucide-react";
import { useTransition } from "react";
import { Button, Checkbox, cn, ElementProps, toOSMCoordinates } from "ui";

type PeakListEntryProps = ElementProps<"div"> & {
  fell: {
    id: number;
    name: string;
    metres: number;
    lat: number;
    lng: number;
  };
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
  const { setZoomPoint } = useMapInteractionContext();
  const [isPending, startTransition] = useTransition();

  const _className = cn("flex group py-1 px-1 gap-2 items-center justify-between hover:bg-gray-50", className);

  return (
    <div className={_className} {...rest}>
      <div className="flex gap-2 py-2 items-center">
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
      <Button
        variant="ghost"
        className="hidden md:block text-gray-200 hover:text-gray-400"
        onClick={() => setZoomPoint({ coordinates: toOSMCoordinates([fell.lng, fell.lat]), zoom: 14 }, true)}
      >
        <Locate className="text-[inherit]" />
      </Button>
    </div>
  );
};
