"use server";

import { createTimelineEntry, updateTimelineEntry } from "database";
import { revalidatePath } from "next/cache";

export const toggleTimelineEntry = async (userId: string | null, fellId: number, checked: boolean) => {
  if (!userId) {
    return;
  }

  await createTimelineEntry(userId, fellId, checked);

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
