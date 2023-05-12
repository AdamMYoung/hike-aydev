"use server";

import { getCachedEntry } from "../libs/cache";
import { prisma } from "../libs/db";
import { FellDTO, FellGroupDTO } from "../types";

export const getFellGroups = (): Promise<FellGroupDTO[]> => {
  return getCachedEntry(`get-fell-groups`, async () => {
    const groups = await prisma.fellGroup.findMany({
      where: { published: true },
      include: { _count: { select: { fells: true } } },
    });

    return groups.map((group) => ({
      id: group.id,
      name: group.name,
      imageUrl: group.imageUrl ?? "",
      fellCount: group._count.fells,
    }));
  });
};

export const getFellGroup = (fellGroupId: number): Promise<FellGroupDTO> => {
  return getCachedEntry(`get-fell-group-${fellGroupId}`, async () => {
    const group = await prisma.fellGroup.findUnique({
      where: { id: fellGroupId },
      include: { _count: { select: { fells: true } } },
    });

    if (!group) {
      throw new Error(`Fell group with id ${fellGroupId} not found`);
    }

    return {
      id: group.id,
      name: group.name,
      imageUrl: group.imageUrl ?? "",
      fellCount: group._count.fells,
    };
  });
};

export const getAllFells = (): Promise<FellDTO[]> => {
  return getCachedEntry(`get-all-fells`, async () => {
    const fells = await prisma.fell.findMany({
      where: { fellGroups: { some: { published: true } } },
      include: { fellGroups: { select: { id: true } } },
    });

    return fells.map((fell) => ({
      id: fell.id,
      fellGroupIds: fell.fellGroups.map((g) => g.id),
      name: fell.name,
      lat: fell.lat,
      lng: fell.lng,
      metres: fell.metres,
      feet: fell.feet,
    }));
  });
};

export const getFellsByGroupId = (groupId: number): Promise<FellDTO[]> => {
  return getCachedEntry(`get-fells-by-group-id-${groupId}`, async () => {
    const group = await prisma.fellGroup.findUnique({
      where: { id: groupId },
      select: {
        fells: {
          select: {
            id: true,
            name: true,
            lat: true,
            lng: true,
            metres: true,
            feet: true,
            fellGroups: { select: { id: true } },
          },
        },
      },
    });

    if (!group) {
      throw new Error(`Group with id ${groupId} not found`);
    }

    return group.fells.map((fell) => ({
      id: fell.id,
      fellGroupIds: fell.fellGroups.map((g) => g.id),
      name: fell.name,
      lat: fell.lat,
      lng: fell.lng,
      metres: fell.metres,
      feet: fell.feet,
    }));
  });
};
