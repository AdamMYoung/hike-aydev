import axios from "axios";
import { prisma } from "database";
import { TokenSet } from "next-auth";

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
export async function refreshAccessToken(accountId: string, refreshToken: string) {
  const url =
    "https://www.strava.com/oauth/token?" +
    new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID ?? "",
      client_secret: process.env.STRAVA_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

  const response = await axios.post(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  const refreshedTokens: TokenSet = response.data;

  if (response.status !== 200) {
    throw refreshedTokens;
  }

  await prisma.account.update({
    data: {
      access_token: refreshedTokens.access_token,
      expires_at: refreshedTokens.expires_at,
      refresh_token: refreshedTokens.refresh_token ?? refreshToken,
    },
    where: {
      provider_providerAccountId: {
        provider: "strava",
        providerAccountId: accountId,
      },
    },
  });

  return {
    accessToken: refreshedTokens.access_token,
    accessTokenExpires: refreshedTokens.expires_at,
    refreshToken: refreshedTokens.refresh_token ?? refreshToken, // Fall back to old refresh token
  };
}
