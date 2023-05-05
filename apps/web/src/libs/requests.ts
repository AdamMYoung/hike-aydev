import "server-only";

import { cache } from "react";
import { prisma } from "./prisma";
import { User } from "./session";

export const getFellEntry = cache(async (id: string) => {
  return await prisma.fell.findUnique({ where: { id: parseInt(id) } });
});

export const getFellGroup = cache(async (id: string) => {
  return await prisma.fellGroup.findUnique({
    where: { id: parseInt(id) },
    include: {
      fells: {
        where: {
          published: true,
        },
      },
    },
  });
});

export const getFellGroups = cache(async () => {
  return await prisma.fellGroup.findMany({
    where: {
      published: true,
    },
    include: {
      _count: { select: { fells: true } },
    },
  });
});

export const getUserFellGroupCompletion = cache(async (user: User | null) => {
  if (!user || !user.id) {
    return [];
  }

  return await prisma.logEntry.findMany({
    include: {
      fell: {
        select: {
          fellGroups: {
            select: {
              id: true,
            },
          },
        },
      },
    },
    where: {
      authorId: user.id,
      climbed: true,
    },
  });
});

export const getUserLogEntries = cache(async (userId: string | null) => {
  if (!userId) {
    return [];
  }

  return await prisma.logEntry.findMany({
    where: {
      authorId: userId,
    },
  });
});
