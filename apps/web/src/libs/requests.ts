import "server-only";

import { cache } from "react";
import { prisma } from "./prisma";

export const getFellEntry = cache(async (id: string) => {
  return await prisma.fell.findUnique({ where: { id: parseInt(id) } });
});

export const getFellGroup = cache(async (id: string) => {
  return await prisma.fellGroup.findUnique({
    where: { id: parseInt(id) },
    include: {
      fells: {
        select: {
          id: true,
          name: true,
          imageUrl: true,
          metres: true,
          lat: true,
          lng: true,
        },
      },
    },
  });
});

export const getFells = cache(async () => {
  return await prisma.fellGroup.findMany({
    include: {
      _count: { select: { fells: true } },
    },
  });
});
