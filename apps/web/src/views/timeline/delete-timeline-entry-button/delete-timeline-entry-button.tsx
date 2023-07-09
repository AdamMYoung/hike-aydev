"use client";

import { deleteTimelineGroup } from "@libs/actions";
import { Trash } from "lucide-react";
import { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
  cn,
  ElementProps,
} from "ui";

type DeleteTimelineEntryButtonProps = Omit<ElementProps<"button">, "children"> & {
  start: Date | null;
  userId: string | null;
};

export const DeleteTimelineEntryButton = ({ start, userId, className, ...rest }: DeleteTimelineEntryButtonProps) => {
  const [isPending, startTransition] = useTransition();

  return (
    <>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            disabled={isPending}
            type="submit"
            variant="ghost"
            className={cn("px-2 text-gray-300 opacity-0 transition-opacity group-hover/delete:opacity-100", className)}
            {...rest}
          >
            <Trash className="h-6 w-6" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete entry?</AlertDialogTitle>
            <AlertDialogDescription>
              You can re-sync timeline entries at any time by navigating to the &quot;Data&quot; tab.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() =>
                  startTransition(() => {
                    deleteTimelineGroup(userId, start);
                  })
                }
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
