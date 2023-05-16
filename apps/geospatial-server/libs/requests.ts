import { prisma } from "./prisma";
import { getCachedEntry } from "./kv";

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
