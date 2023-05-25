"use server";

import { clearCachedEntry, getCachedEntry } from "../libs/cache";
import { prisma } from "../libs/db";
import { TimelineDetailEntryDTO, TimelineEntryDTO } from "../types";

export const getUserTimelineById = async (userId?: string | null): Promise<TimelineDetailEntryDTO[]> => {
  if (!userId) {
    return [];
  }

  return getCachedEntry(`get-user-timeline-by-id-${userId}`, async () => {
    const timelineEntries = await prisma.logEntry.findMany({
      where: { authorId: userId, climbed: true },
      orderBy: { date: "desc" },
      include: { fell: { select: { id: true, name: true, lat: true, lng: true, feet: true, metres: true } } },
    });

    return timelineEntries.map((entry) => ({
      fell: {
        name: entry.fell.name,
        id: entry.fell.id,
        lat: entry.fell.lat,
        lng: entry.fell.lng,
        metres: entry.fell.metres,
        feet: entry.fell.feet,
      },
      date: entry.date,
      climbed: entry.climbed,
      camped: entry.camped,
      comments: entry.comments,
    }));
  });
};

export const getCompletedFellsGroupedByFellGroups = async (
  userId?: string | null
): Promise<Record<number, TimelineEntryDTO[]>> => {
  if (!userId) {
    return {};
  }

  return getCachedEntry(`get-completed-fells-grouped-by-fell-groups-${userId}`, async () => {
    const completedFells = await prisma.logEntry.findMany({
      where: { authorId: userId, climbed: true },
      include: { fell: { select: { id: true, name: true, fellGroups: true } } },
    });

    const groupedFells: Record<number, TimelineEntryDTO[]> = {};

    completedFells.forEach((entry) => {
      entry.fell.fellGroups.forEach((fellGroup) => {
        if (!groupedFells[fellGroup.id]) {
          groupedFells[fellGroup.id] = [];
        }

        groupedFells[fellGroup.id].push({
          fellId: entry.fell.id,
          date: entry.date,
          climbed: entry.climbed,
          camped: entry.camped,
          comments: entry.comments,
        });
      });
    });

    return groupedFells;
  });
};

export const createTimelineEntry = async (
  userId: string,
  fellId: number,
  climbed: boolean
): Promise<TimelineDetailEntryDTO> => {
  const entry = await prisma.logEntry.upsert({
    where: { authorId_fellId: { authorId: userId, fellId } },
    create: { authorId: userId, fellId, climbed: true },
    update: { climbed },
    include: { fell: { select: { id: true, name: true, lat: true, lng: true, metres: true, feet: true } } },
  });

  await clearCachedEntry(`get-user-timeline-by-id-${userId}`);
  await clearCachedEntry(`get-completed-fells-grouped-by-fell-groups-${userId}`);

  return {
    fell: {
      name: entry.fell.name,
      id: entry.fell.id,
      lat: entry.fell.lat,
      lng: entry.fell.lng,
      metres: entry.fell.metres,
      feet: entry.fell.feet,
    },
    date: entry.date,
    climbed: entry.climbed,
    camped: entry.camped,
    comments: entry.comments,
  };
};

export const createTimelineEntries = async (
  userId: string,
  entries: TimelineEntryDTO[]
): Promise<TimelineDetailEntryDTO[]> => {
  await prisma.logEntry.createMany({
    skipDuplicates: true,
    data: entries.map((entry) => ({ authorId: userId, fellId: entry.fellId, climbed: entry.climbed })),
  });

  await clearCachedEntry(`get-user-timeline-by-id-${userId}`);
  await clearCachedEntry(`get-completed-fells-grouped-by-fell-groups-${userId}`);

  // Need to re-query the database since createMany doesn't return the created entries back.
  return getUserTimelineById(userId);
};

export const deleteTimelineEntry = async (userId: string, timelineEntryId: string): Promise<TimelineEntryDTO> => {
  const entry = await prisma.logEntry.delete({
    where: { id: timelineEntryId },
    include: { fell: { select: { id: true } } },
  });

  await clearCachedEntry(`get-user-timeline-by-id-${userId}`);
  await clearCachedEntry(`get-completed-fells-grouped-by-fell-groups-${userId}`);

  return {
    fellId: entry.fell.id,
    date: entry.date,
    climbed: entry.climbed,
    camped: entry.camped,
    comments: entry.comments,
  };
};

export const updateTimelineEntry = async (
  userId: string,
  timelineEntryId: string,
  data: Partial<TimelineEntryDTO>
): Promise<TimelineDetailEntryDTO> => {
  const entry = await prisma.logEntry.update({
    where: { id: timelineEntryId },
    data: { climbed: data.climbed, camped: data.camped, comments: data.comments },
    include: { fell: { select: { id: true, name: true, lat: true, lng: true, feet: true, metres: true } } },
  });

  await clearCachedEntry(`get-user-timeline-by-id-${userId}`);
  await clearCachedEntry(`get-completed-fells-grouped-by-fell-groups-${userId}`);

  return {
    fell: {
      name: entry.fell.name,
      id: entry.fell.id,
      lat: entry.fell.lat,
      lng: entry.fell.lng,
      metres: entry.fell.metres,
      feet: entry.fell.feet,
    },
    date: entry.date,
    climbed: entry.climbed,
    camped: entry.camped,
    comments: entry.comments,
  };
};
