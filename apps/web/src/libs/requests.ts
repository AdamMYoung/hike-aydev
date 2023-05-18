import "server-only";

import { cache } from "react";
import { prisma } from "./prisma";
import { getCachedEntry } from "./kv";

export const getFellEntry = cache(async (id: string) => {
  return getCachedEntry(`get-fell-entry-${id}`, () => prisma.fell.findUnique({ where: { id: parseInt(id) } }));
});

export const getFellGroup = cache(async (id?: string | null) => {
  if (!id) {
    return null;
  }

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
            lat: true,
            lng: true,
          },
          where: {
            published: true,
          },
        },
      },
    })
  );
});

export const getMapFellGroup = cache(async (id: string) => {
  return getCachedEntry(`get-map-fell-group-${id}`, () =>
    prisma.fellGroup.findUnique({
      where: { id: parseInt(id) },
      select: {
        fells: {
          select: { id: true, name: true, lat: true, lng: true },
          where: {
            published: true,
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

export const getFellPoints = () => {
  return getCachedEntry("get-fell-points", () =>
    prisma.fell.findMany({
      select: {
        id: true,
        lat: true,
        lng: true,
        name: true,
      },
    })
  );
};

export const getUserFellGroupCompletion = async (userId?: string | null) => {
  if (!userId) {
    return [];
  }

  const completedIds = await prisma.logEntry.findMany({
    select: {
      fellId: true,
    },
    where: {
      authorId: userId,
      climbed: true,
    },
  });

  return prisma.fellGroup.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      _count: {
        select: {
          fells: {
            where: { id: { in: completedIds.map((i) => i.fellId) } },
          },
        },
      },
    },
  });
};

export const getUserLogEntries = async (userId?: string | null) => {
  if (!userId) {
    return [];
  }

  return prisma.logEntry.findMany({
    where: {
      authorId: userId,
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const getUserTimeline = async (userId?: string | null) => {
  if (!userId) {
    return [];
  }

  return prisma.logEntry.findMany({
    select: {
      id: true,
      date: true,
      camped: true,
      comments: true,
      fell: {
        select: {
          id: true,
          name: true,
          lat: true,
          lng: true,
        },
      },
    },
    where: {
      authorId: userId,
      climbed: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const getMapUserTimeline = async (userId?: string | null) => {
  if (!userId) {
    return [];
  }

  return prisma.logEntry.findMany({
    select: {
      fell: {
        select: {
          id: true,
          name: true,
          lat: true,
          lng: true,
        },
      },
    },
    where: {
      authorId: userId,
      climbed: true,
    },
    orderBy: {
      date: "desc",
    },
  });
};

export const getIsStravaLinked = async (userId?: string | null) => {
  if (!userId) {
    return false;
  }

  const userOauthToken = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Account: {
        where: {
          provider: "strava",
        },
        select: {
          access_token: true,
        },
      },
    },
  });

  return !!userOauthToken?.Account[0]?.access_token;
};
