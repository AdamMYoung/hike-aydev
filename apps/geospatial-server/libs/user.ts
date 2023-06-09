import { FastifyRequest } from "fastify";

import { refreshAccessToken } from "./strava";
import { prisma } from "database";

export const getUserSession = async (request: FastifyRequest) => {
  const sessionToken =
    request.cookies[
      process.env.RUNTIME_ENV === "production" ? "__Secure-next-auth.session-token" : "next-auth.session-token"
    ];

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session || session.expires.getTime() < Date.now()) {
    return null;
  }

  return session.user;
};

export const getStravaAccessToken = async ({
  stravaId,
  accessToken,
  refreshToken,
  expiresAt,
}: {
  stravaId: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}) => {
  let token = accessToken;

  if (expiresAt && expiresAt < Math.floor(Date.now() / 1000)) {
    const refreshedTokens = await refreshAccessToken(stravaId, refreshToken);
    token = refreshedTokens.accessToken ?? accessToken;
  }

  return token;
};
