import { prisma } from "./prisma";

export const getUserByStravaId = async (stravaId: string) => {
  return prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        providerAccountId: stravaId,
        provider: "strava",
      },
    },
    select: {
      access_token: true,
      user: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
};
