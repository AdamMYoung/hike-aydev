"use client";

import { useOnClickOutside } from "@/hooks";
import { setComment, setDate } from "@/libs/actions";
import { Save, Trash } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";
import { Button, Calendar, cn, ElementProps, Textarea } from "ui";

type TimelineCardProps = ElementProps<"div"> & {
  logId: string;
  name: string;
  date: Date;
  comments?: string | null;
};

export const TimelineCard = ({ name, date, comments, className, children, logId, ...rest }: TimelineCardProps) => {
  const calendarRef = useRef<HTMLDivElement>(null);
  const [isCommentEditing, setIsCommentEditing] = useState(false);
  const [isDateEditing, setIsDateEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [editComment, setEditComment] = useState(comments);

  useOnClickOutside(calendarRef, () => {
    setIsDateEditing(false);
  });

  const _className = cn("py-2 flex flex-col gap-2", className);

  const handleReset = () => {
    setEditComment(comments);
    setIsCommentEditing(false);
  };

  const handleSave = () => {
    // @ts-ignore
    startTransition(() => setComment(logId, editComment));
  };

  const handleDateSave = (date: Date) => {
    // @ts-ignore
    startTransition(() => setDate(logId, date));
  };

  useEffect(() => {
    if (!isPending) {
      setIsCommentEditing(false);
      setIsDateEditing(false);
    }
  }, [isPending]);

  return (
    <div className={_className} {...rest}>
      <div>
        <h2 className="grow text-xl font-medium">{name}</h2>
        <div className="relative">
          <Button
            variant="link"
            disabled={isDateEditing}
            onClick={() => setIsDateEditing(true)}
            className="text-sm font-normal h-auto w-auto p-0"
          >
            {date.toLocaleDateString()}
          </Button>
          {isDateEditing ? (
            <div ref={calendarRef} className="absolute bg-white border rounded z-10 ">
              <Calendar mode="single" selected={date} onSelect={handleDateSave} />
              <div className="pb-4 w-full px-4">
                <Button
                  aria-label="Cancel"
                  variant="outline"
                  className="hover:bg-red-50 h-auto w-full  p-2 px-2.5"
                  disabled={isPending}
                  onClick={() => setIsDateEditing(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {children}

      {!isCommentEditing ? (
        <div>
          {comments ? (
            <Button variant="link" className="grow text-sm w-auto p-0" onClick={() => setIsCommentEditing(true)}>
              {comments}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsCommentEditing(true)}>
              Add a comment
            </Button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <Textarea value={editComment ?? ""} onChange={(e) => setEditComment(e.target.value)} />
          <div className="flex gap-2 ml-auto">
            <Button
              aria-label="Cancel"
              variant="outline"
              className="hover:bg-red-50 h-auto w-auto p-2"
              disabled={isPending}
              onClick={handleReset}
            >
              <Trash className="h-4 w-4" />
            </Button>
            <Button
              aria-label="Save"
              variant="outline"
              className="hover:bg-green-50 h-auto w-auto p-2"
              disabled={isPending}
              onClick={handleSave}
            >
              <Save className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
