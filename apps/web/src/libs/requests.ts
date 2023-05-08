import "server-only";

import { cache } from "react";
import { prisma } from "./prisma";
import { User } from "./session";
import { getCachedEntry } from "./kv";

export const getFellEntry = cache(async (id: string) => {
  return getCachedEntry(`get-fell-entry-${id}`, () => prisma.fell.findUnique({ where: { id: parseInt(id) } }));
});

export const getFellGroup = cache(async (id: string, searchTerm?: string) => {
  return getCachedEntry(`get-fell-group-${id}`, () =>
    prisma.fellGroup.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        imageUrl: true,
        fells: {
          select: {
            id: true,
            name: true,
            metres: true,
            imageUrl: true,
          },
          where: {
            published: true,
            ...(searchTerm ? { name: { contains: searchTerm, mode: "insensitive" } } : {}),
          },
        },
      },
    })
  );
});

export const getMapFellGroup = cache(async (id: string, searchTerm?: string) => {
  return getCachedEntry(`get-map-fell-group-${id}`, () =>
    prisma.fellGroup.findUnique({
      where: { id: parseInt(id) },
      select: {
        fells: {
          select: { id: true, lat: true, lng: true },
          where: {
            published: true,
            ...(searchTerm ? { name: { contains: searchTerm, mode: "insensitive" } } : {}),
          },
        },
      },
    })
  );
});

export const getFellGroups = cache(async () => {
  return getCachedEntry("get-fell-groups", () =>
    prisma.fellGroup.findMany({
      where: {
        published: true,
      },
      select: {
        name: true,
        id: true,
        imageUrl: true,
        _count: { select: { fells: true } },
      },
    })
  );
});

export const getUserFellGroupCompletion = cache(async (user: User | null) => {
  if (!user || !user.id) {
    return [];
  }

  return await prisma.logEntry.findMany({
    select: {
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
