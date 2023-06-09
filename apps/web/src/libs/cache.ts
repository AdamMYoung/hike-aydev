import "server-only";
import {
  getFellGroup,
  getFellGroups,
  getFellsByGroupId,
  getUserStravaLinkStatus,
  getUserTimelineById,
  TimelineEntryDTO,
  getUserGearLists,
  getUserGearList,
  getUserGearItems,
} from "database";
import { cache } from "react";
import { getCurrentUser } from "./session";

export const preload = (userId?: string | null) => {
  void getCachedCurrentUser();
  void getCachedFellGroups();

  void getCachedUserTimelineById(userId);
  void getCachedFlattenedTimelineEntries(userId);
  void getCachedUserStravaLinkStatus(userId);
};

export const getCachedCurrentUser = cache(() => getCurrentUser());

export const getCachedFellGroups = cache(() => getFellGroups());

export const getCachedFellGroup = cache((groupId: number) => getFellGroup(groupId));

export const getCachedFells = cache((groupId: number) => getFellsByGroupId(groupId));

export const getCachedUserStravaLinkStatus = cache((userId?: string | null) => getUserStravaLinkStatus(userId));

export const getCachedUserTimelineById = cache((userId?: string | null) => getUserTimelineById(userId));

export const getCachedFlattenedTimelineEntries = async (userId?: string | null) => {
  const groups = await getCachedUserTimelineById(userId);
  const entries: TimelineEntryDTO[] = [];

  groups.forEach((group) => group.entries.forEach((entry) => entries.push(entry)));

  return entries;
};

export const getCachedUserGearLists = cache((userId: string) => getUserGearLists(userId));
export const getCachedUserGearItems = cache((userId: string) => getUserGearItems(userId));
export const getCachedUserGearList = cache((gearListId: string, userId?: string | null) =>
  getUserGearList(gearListId, userId)
);
