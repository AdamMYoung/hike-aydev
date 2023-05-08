"use client";

import { setComment } from "@/libs/actions";
import { Save, Trash } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Button, cn, ElementProps, Textarea } from "ui";

type TimelineCardProps = ElementProps<"div"> & {
  logId: string;
  name: string;
  date: Date;
  comments?: string | null;
};

export const TimelineCard = ({ name, date, comments, className, children, logId, ...rest }: TimelineCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editComment, setEditComment] = useState(comments);

  const _className = cn("py-4 flex flex-col gap-4", className);

  const handleReset = () => {
    setEditComment(comments);
    setIsEditing(false);
  };

  const handleSave = () => {
    // @ts-ignore
    startTransition(() => setComment(logId, editComment));
  };

  useEffect(() => {
    if (!isPending) {
      setIsEditing(false);
    }
  }, [isPending]);

  return (
    <div className={_className} {...rest}>
      <div>
        <h2 className="grow  text-lg font-medium">{name}</h2>
        <p className="text-[11px]">{date.toLocaleDateString()}</p>
      </div>

      {children}

      {!isEditing ? (
        <div>
          {comments ? (
            <Button variant="link" className="grow text-sm" onClick={() => setIsEditing(true)}>
              {comments}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Add a comment
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Textarea value={editComment ?? ""} onChange={(e) => setEditComment(e.target.value)} />
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" className="hover:bg-red-50" disabled={isPending} onClick={handleReset}>
              <Trash className="h-6 w-6" />
            </Button>
            <Button variant="outline" className="hover:bg-green-50" disabled={isPending} onClick={handleSave}>
              <Save className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
