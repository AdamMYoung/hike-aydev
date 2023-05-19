import { FastifyRequest } from "fastify";
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

export const getUserSession = async (request: FastifyRequest) => {
  const sessionToken = request.cookies["next-auth.session-token"];

  const session = await prisma.session.findUnique({
    where: {
      sessionToken,
    },
    include: {
      user: true,
    },
  });

  if (!session || session.expires.getTime() < Date.now()) {
    return null;
  }

  return session.user;
};
