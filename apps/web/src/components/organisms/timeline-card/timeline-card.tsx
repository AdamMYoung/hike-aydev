"use client";

import { setComment } from "@/libs/actions";
import { ImagePlus, MessageCircle, Save, Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button, cn, ElementProps, Textarea } from "ui";

type TimelineCardProps = ElementProps<"div"> & {
  logId: string;
  name: string;
  date: Date;
  comments?: string | null;
};

export const TimelineCard = ({ name, date, comments, className, children, logId, ...rest }: TimelineCardProps) => {
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editComment, setEditComment] = useState(comments);

  const _className = cn("group px-4 py-1 flex flex-col gap-1", isCommentEditing && "py-2", className);

  const handleReset = () => {
    setEditComment(comments);
    setIsCommentEditing(false);
  };

  const handleSave = () => {
    // @ts-ignore
    startTransition(() => setComment(logId, editComment));
  };

  useEffect(() => {
    if (!isPending) {
      setIsCommentEditing(false);
    }
  }, [isPending]);

  return (
    <div className={_className} {...rest}>
      <div className="flex items-center gap-2">
        <h2 className="grow text-sm font-normal">{name}</h2>
        {!isCommentEditing ? (
          <div className="opacity-20 transition-opacity flex gap-2 group-hover:opacity-100">
            <Button className="p-2 bg-white" variant="ghost" onClick={() => setIsCommentEditing(true)}>
              <MessageCircle />
            </Button>
            {/* <Button className="p-2 bg-white" variant="ghost" onClick={() => setIsCommentEditing(true)}>
              <ImagePlus />
            </Button> */}
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
              <Trash />
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
