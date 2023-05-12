"use server";

import { LogSource } from "@prisma/client";
import { clearCachedEntry, getCachedEntry } from "../libs/cache";
import { prisma } from "../libs/db";
import { TimelineEntryDTO, TimelineGroupDTO } from "../types";

const clearTimelineCache = async (userId: string) => {
  return Promise.all([clearCachedEntry(`get-user-timeline-by-id-${userId}`)]);
};

export const getUserTimelineById = async (userId?: string | null): Promise<TimelineGroupDTO[]> => {
  if (!userId) {
    return [];
  }

  return getCachedEntry(`get-user-timeline-by-id-${userId}`, async () => {
    const groups = await prisma.logGroup.findMany({
      where: { authorId: userId },
      orderBy: { start: "desc" },
      include: {
        logEntries: {
          select: {
            id: true,
            fell: { include: { fellGroups: { select: { id: true } } } },
            climbed: true,
            camped: true,
            comments: true,
          },
        },
      },
    });

    return groups.map((group) => {
      return {
        id: group.id,
        start: group.start.toISOString(),
        end: group.end?.toISOString() ?? null,
        source: group.source,
        polyline: group.polyline,
        entries: group.logEntries.map((entry) => {
          return {
            id: entry.id,
            climbed: entry.climbed,
            camped: entry.camped,
            comments: entry.comments,
            fell: {
              id: entry.fell.id,
              fellGroupIds: entry.fell.fellGroups.map((g) => g.id),
              name: entry.fell.name,
              lat: entry.fell.lat,
              lng: entry.fell.lng,
              metres: entry.fell.metres,
              feet: entry.fell.feet,
            },
          };
        }),
      };
    });
  });
};

export const createTimelineEntry = async (
  userId: string,
  fellId: number,
  climbed: boolean
): Promise<TimelineEntryDTO> => {
  const start = new Date();

  const upsetGroupResult = await prisma.logGroup.upsert({
    where: { start_authorId: { start, authorId: userId } },
    create: {
      authorId: userId,
      start,
      source: LogSource.MANUAL,
    },
    update: {},
  });

  const entry = await prisma.logEntry.upsert({
    where: { authorId_fellId: { authorId: userId, fellId } },
    create: { authorId: userId, fellId, climbed: true, logGroupId: upsetGroupResult.id },
    update: { climbed },
    include: {
      fell: {
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

  await clearTimelineCache(userId);

  return {
    fell: {
      name: entry.fell.name,
      id: entry.fell.id,
      fellGroupIds: entry.fell.fellGroups.map((g) => g.id),
      lat: entry.fell.lat,
      lng: entry.fell.lng,
      metres: entry.fell.metres,
      feet: entry.fell.feet,
    },
    id: entry.id,
    climbed: entry.climbed,
    camped: entry.camped,
    comments: entry.comments,
  };
};

export const deleteTimelineEntry = async (userId: string, timelineEntryId: string): Promise<TimelineEntryDTO> => {
  const entry = await prisma.logEntry.delete({
    where: { id: timelineEntryId },
    include: { fell: { include: { fellGroups: { select: { id: true } } } } },
  });

  await clearTimelineCache(userId);

  return {
    id: entry.id,
    climbed: entry.climbed,
    camped: entry.camped,
    comments: entry.comments,
    fell: {
      name: entry.fell.name,
      id: entry.fell.id,
      lat: entry.fell.lat,
      lng: entry.fell.lng,
      metres: entry.fell.metres,
      fellGroupIds: entry.fell.fellGroups.map((g) => g.id),
      feet: entry.fell.feet,
    },
  };
};

export const updateTimelineEntry = async (
  userId: string,
  timelineEntryId: string,
  data: Partial<TimelineEntryDTO>
): Promise<TimelineEntryDTO> => {
  const entry = await prisma.logEntry.update({
    where: { id: timelineEntryId },
    data: { climbed: data.climbed, camped: data.camped, comments: data.comments },
    include: {
      fell: {
        select: {
          id: true,
          name: true,
          lat: true,
          lng: true,
          feet: true,
          metres: true,
          fellGroups: { select: { id: true } },
        },
      },
    },
  });

  await clearTimelineCache(userId);

  return {
    fell: {
      name: entry.fell.name,
      id: entry.fell.id,
      fellGroupIds: entry.fell.fellGroups.map((g) => g.id),
      lat: entry.fell.lat,
      lng: entry.fell.lng,
      metres: entry.fell.metres,
      feet: entry.fell.feet,
    },
    id: entry.id,
    climbed: entry.climbed,
    camped: entry.camped,
    comments: entry.comments,
  };
};
