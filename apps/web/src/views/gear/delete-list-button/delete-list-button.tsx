"use client";

import { deleteGearList, deleteUserProfile } from "@libs/actions";
import { Trash } from "lucide-react";
import { signOut } from "next-auth/react";
import { redirect } from "next/navigation";
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
} from "ui";

type DeleteListButtonProps = {
  userId: string | null;
  listId: string | null;
  listName: string;
};

export const DeleteListButton = ({ userId, listId, listName }: DeleteListButtonProps) => {
  const [isTransitioning, startTransition] = useTransition();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="submit" disabled={isTransitioning} className="p-2" variant="ghost">
          <Trash className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete list &apos;{listName}&apos;?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() =>
                startTransition(() => {
                  deleteGearList(userId, listId);
                  redirect("/gear");
                })
              }
            >
              Yes, delete list
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
