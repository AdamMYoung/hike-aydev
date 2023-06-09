"use client";

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
  ElementProps,
} from "ui";

import { deleteUserProfile } from "@libs/actions";
import { useTransition } from "react";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";

type DeleteAccountButtonProps = ElementProps<typeof Button> & {
  userId?: string | null;
};

export const DeleteAccountButton = async ({ className, userId, ...rest }: DeleteAccountButtonProps) => {
  const [isPending, startTransition] = useTransition();

  if (!userId) {
    return;
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button type="submit" variant="destructive" className="w-full" {...rest}>
          Delete Profile
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={() =>
                startTransition(() => {
                  deleteUserProfile(userId);
                  signOut();
                })
              }
            >
              Yes, delete account
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
