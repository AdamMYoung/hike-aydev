"use server";

import {
  createTimelineEntry,
  deleteUser,
  updateTimelineEntry,
  deleteTimelineGroup as deleteTimelineGroupDb,
  deleteTimelineEntry,
} from "database";
import { revalidatePath } from "next/cache";

export const toggleTimelineEntry = async (userId: string | null, fellId: number, checked: boolean) => {
  if (!userId) {
    return;
  }

  if (checked) {
    await createTimelineEntry(userId, fellId);
  } else {
    await deleteTimelineEntry(userId, fellId);
  }

  revalidatePath(`/`);
  revalidatePath(`/timeline`);
  revalidatePath(`/group/${fellId}`);
};

export const setTimelineEntryComment = async (userId: string, entryId: string, comments?: string) => {
  if (!userId) {
    return;
  }

  await updateTimelineEntry(userId, entryId, { comments });

  revalidatePath(`/timeline`);
};

export const deleteUserProfile = async (userId: string | null) => {
  if (!userId) {
    return;
  }

  await deleteUser(userId);
};

export const deleteTimelineGroup = async (userId: string | null, start: Date | null) => {
  if (!userId || !start) {
    return;
  }

  console.log(userId, start);

  await deleteTimelineGroupDb(userId, start);
};
