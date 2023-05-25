import "server-only";
import { getFellGroup, getFellGroups, getFellsByGroupId } from "database";
import { cache } from "react";

export const getCachedFellGroups = cache(() => getFellGroups());

export const getCachedFellGroup = cache((groupId: number) => getFellGroup(groupId));

export const getCachedFells = cache((groupId: number) => getFellsByGroupId(groupId));
