"use server";

import { clearCachedEntry, getCachedEntry } from "../libs/cache";
import { prisma } from "../libs/db";
import { TimeoutDTO } from "../types";

const clearDataCache = async (userId: string) => {
  return clearCachedEntry(`get-user-timeouts-${userId}`);
};

export const getUserTimeouts = async (userId?: string | null): Promise<TimeoutDTO[]> => {
  if (!userId) {
    return [];
  }

  return getCachedEntry(`get-user-timeouts-${userId}`, async () => {
    const timeouts = await prisma.userEventTimeout.findMany({
      where: { userId },
      select: { expires: true, event: true },
    });

    return timeouts.map((timeout) => ({
      expires: timeout.expires.toISOString(),
      event: timeout.event,
    }));
  });
};

export const createTimeout = async (userId: string, timeout: TimeoutDTO): Promise<TimeoutDTO> => {
  const createdTimeout = await prisma.userEventTimeout.create({
    data: { userId, expires: timeout.expires, event: timeout.event },
  });

  await clearDataCache(userId);

  return {
    expires: createdTimeout.expires.toISOString(),
    event: createdTimeout.event,
  };
};
