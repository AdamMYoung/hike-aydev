import { prisma } from "./prisma";
import { getCachedEntry } from "./kv";
import NodeCache from "node-cache";

const fellCache = new NodeCache({ stdTTL: 3600 });

export type FellPoint = {
  id: number;
  lat: number;
  lng: number;
  name: string;
};

export const getFellPoints = async () => {
  const fellPoints = fellCache.get<FellPoint[]>("get-fell-points");

  if (fellPoints) {
    return fellPoints;
  }

  const fetchedFellPoints = await getCachedEntry("get-fell-points", () =>
    prisma.fell.findMany({
      select: {
        id: true,
        lat: true,
        lng: true,
        name: true,
      },
    })
  );

  fellCache.set("get-fell-points", fetchedFellPoints);

  return fetchedFellPoints;
};
