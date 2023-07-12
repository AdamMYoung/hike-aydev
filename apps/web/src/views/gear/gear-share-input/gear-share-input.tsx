"use client";

import { MouseEventHandler } from "react";
import { Input, toast } from "ui";

type GearShareInputProps = {
  gearListId: string;
};

export const GearShareInput = ({ gearListId }: GearShareInputProps) => {
  const shareUrl = `${window.location.origin}/share/gear/${gearListId}`;

  const handleClick: MouseEventHandler<HTMLInputElement> = (event) => {
    window.navigator.clipboard.writeText(shareUrl);
    event.currentTarget.select();

    toast({
      title: "Link copied to clipboard!",
      className: "bg-green-200 text-black border-muted",
    });
  };

  return (
    <div className="px-6 pt-4 max-w-sm">
      <label>
        Share your list!
        <Input onClick={handleClick} className="mt-1" readOnly value={shareUrl} />
      </label>
    </div>
  );
};
