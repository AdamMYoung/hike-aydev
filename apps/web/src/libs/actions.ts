"use server";

import { Fell } from "database";
import { revalidatePath } from "next/cache";
import { prisma } from "./prisma";

export const setFellStatus = async (fell: Fell, fellGroupId: number, userId: string | null, completed: boolean) => {
  if (!userId) {
    return;
  }

  await prisma.logEntry.upsert({
    where: {
      authorId_fellId: {
        authorId: userId,
        fellId: fell.id,
      },
    },
    create: {
      fellId: fell.id,
      authorId: userId,
      climbed: completed,
    },
    update: {
      climbed: completed,
    },
  });

  revalidatePath(`/group/${fellGroupId}`);
  revalidatePath(`/`);
};

export const setComment = async (logId: string, comment: string) => {
  await prisma.logEntry.update({
    where: {
      id: logId,
    },
    data: {
      comments: comment,
    },
  });

  revalidatePath(`/timeline`);
};

export const setDate = async (logId: string, date: Date) => {
  await prisma.logEntry.update({
    where: {
      id: logId,
    },
    data: {
      date,
    },
  });

  revalidatePath(`/timeline`);
};
