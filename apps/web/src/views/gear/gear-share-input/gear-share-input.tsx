"use client";

import { Copy } from "lucide-react";
import { MouseEventHandler } from "react";
import { Button, toast } from "ui";

type GearShareInputProps = {
  gearListId: string;
};

export const GearShareInput = ({ gearListId }: GearShareInputProps) => {
  const shareUrl = `${window.location.origin}/share/gear/${gearListId}`;

  const handleClick: MouseEventHandler<HTMLButtonElement> = () => {
    window.navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link copied to clipboard!",
      className: "bg-green-200 text-black border-muted",
    });
  };

  return (
    <div className="w-full mx-auto">
      <Button variant="outline" onClick={handleClick} className="items-center flex gap-2 w-full">
        <Copy /> Copy Share URL
      </Button>
    </div>
  );
};
