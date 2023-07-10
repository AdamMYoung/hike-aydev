"use client";

import { useIsMobile } from "@/hooks/use-is-mobile";
import { toggleTimelineEntry } from "@libs/actions";
import { Loader, Locate } from "lucide-react";
import { useTransition } from "react";
import { Button, Checkbox, cn, ElementProps, useInteractionProvider, useMapProvider } from "ui";

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
  const { map } = useMapProvider();
  const isMobile = useIsMobile();
  const { setIsManual, setIsMobileMapOpen } = useInteractionProvider();
  const [isPending, startTransition] = useTransition();

  const _className = cn(
    "group flex group py-1 px-1 gap-2 items-center justify-between text-sm xl:text-base hover:bg-muted",
    className
  );

  const handleClick = () => {
    if (!map) {
      return;
    }

    setIsManual(true);

    if (isMobile) {
      setIsMobileMapOpen(true);
    }

    map.easeTo({
      center: [fell.lng, fell.lat],
      zoom: isMobile ? 14 : 15,
      pitch: 60,
      duration: 4000,
    });
  };

  return (
    <div className={_className} {...rest}>
      <div className="flex gap-2 py-2 items-center">
        {isPending ? (
          <Loader className="animate-spin h-6 w-6 text-gray-500" />
        ) : (
          <Checkbox
            disabled={disabled || isPending}
            checked={checked}
            onClick={() => startTransition(() => toggleTimelineEntry(userId, fell.id, !checked))}
            className="h-6 w-6 border-muted"
          />
        )}
        <label>
          {fell.name} ({fell.metres}m)
        </label>
      </div>
      <Button onClick={handleClick} variant="ghost" className=" transition-opacity opacity-20 group-hover:opacity-100">
        <Locate className="text-[inherit]" />
      </Button>
    </div>
  );
};
