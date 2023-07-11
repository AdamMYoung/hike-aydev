"use server";

import {
  createTimelineEntry,
  deleteUser,
  updateTimelineEntry,
  deleteTimelineGroup as deleteTimelineGroupDb,
  deleteGearList as deleteGearListDb,
  updateGearList as updateGearListDb,
  deleteUserGearItem,
  deleteTimelineEntry,
  createGearList,
  GearListDetailDTO,
} from "database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Timeline

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

export const deleteTimelineGroup = async (userId: string | null, start: Date | null) => {
  if (!userId || !start) {
    return;
  }

  await deleteTimelineGroupDb(userId, start);
};

// Profile

export const deleteUserProfile = async (userId: string | null) => {
  if (!userId) {
    return;
  }

  await deleteUser(userId);
};

// Gear

export const createNewGearList = async (userId: string | null) => {
  if (!userId) {
    return;
  }

  const list = await createGearList(userId);

  revalidatePath("/gear");
  revalidatePath(`/gear/${list.id}`);
};

export const updateGearList = async (userId: string | null, data: GearListDetailDTO) => {
  if (!userId) {
    return;
  }

  await updateGearListDb(userId, data);

  revalidatePath("/gear");
  revalidatePath(`/gear/${data.id}`);
};

export const deleteGearList = async (userId: string | null, listId: string | null) => {
  if (!userId || !listId) {
    return;
  }

  await deleteGearListDb(userId, listId);

  revalidatePath("/gear");
  revalidatePath(`/gear/${listId}`);
};

export const deleteGearItem = async (userId: string | null, itemId: string | null) => {
  if (!userId || !itemId) {
    return;
  }

  await deleteGearItem(userId, itemId);

  revalidatePath("/gear");
};
