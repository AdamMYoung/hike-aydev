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
