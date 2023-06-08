"use client";

import { Locate, MessageCircle, Save, XCircle } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button, cn, ElementProps, Textarea, useInteractionProvider, useMapProvider } from "ui";

import { setTimelineEntryComment } from "@libs/actions";
import { useIsMobile } from "@/hooks/use-is-mobile";

type TimelineCardProps = ElementProps<"div"> & {
  logId: string;
  comments?: string | null;
  fell: {
    name: string;
    lat: number;
    lng: number;
  };
};

export const TimelineCard = ({ fell, comments, className, children, logId, ...rest }: TimelineCardProps) => {
  const { map } = useMapProvider();
  const isMobile = useIsMobile();
  const { setIsManual, setIsMobileMapOpen } = useInteractionProvider();
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editComment, setEditComment] = useState(comments);

  const _className = cn(
    "group px-4 py-1 flex flex-col gap-1",
    isCommentEditing && "py-2 bg-gray-50",
    !isCommentEditing && "hover:bg-gray-50",
    className
  );

  const handleReset = () => {
    setEditComment(comments);
    setIsCommentEditing(false);
  };

  const handleSave = () => {
    // @ts-ignore
    startTransition(() => setTimelineEntryComment(logId, editComment));
  };

  const handleZoom = () => {
    if (!map) {
      return;
    }

    setIsManual(true);
    setIsMobileMapOpen(true);

    map.easeTo({
      center: [fell.lng, fell.lat],
      zoom: isMobile ? 14 : 15,
      pitch: 60,
      duration: 4000,
    });
  };

  useEffect(() => {
    if (!isPending) {
      setIsCommentEditing(false);
    }
  }, [isPending]);

  return (
    <div className={_className} {...rest}>
      <div className="flex items-center gap-2">
        <h2 className="grow text-sm font-normal">{fell.name}</h2>
        {!isCommentEditing ? (
          <div className="opacity-20 transition-opacity flex gap-2 group-hover:opacity-100">
            <Button variant="ghost" className=" p-2" onClick={() => handleZoom()}>
              <Locate className="text-[inherit]" />
            </Button>
            <Button className="p-2 hidden lg:block" variant="ghost" onClick={() => setIsCommentEditing(true)}>
              <MessageCircle />
            </Button>
          </div>
        ) : null}
      </div>

      {children}

      {!isCommentEditing && comments ? (
        <p className="grow text-xs w-full pb-2">
          <span> - </span>
          {comments}
        </p>
      ) : null}

      {isCommentEditing ? (
        <div className="flex flex-col gap-2">
          <Textarea className="bg-white" value={editComment ?? ""} onChange={(e) => setEditComment(e.target.value)} />
          <div className="flex gap-2 ml-auto">
            <Button
              aria-label="Cancel"
              variant="outline"
              className="hover:bg-red-50 bg-white h-auto w-auto p-2"
              disabled={isPending}
              onClick={handleReset}
            >
              <XCircle />
            </Button>
            <Button
              aria-label="Save"
              variant="outline"
              className="hover:bg-green-50 bg-white h-auto w-auto p-2"
              disabled={isPending}
              onClick={handleSave}
            >
              <Save />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
