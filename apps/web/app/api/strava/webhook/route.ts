import { prisma } from "@/libs/prisma";
import { TokenSet } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("hub.verify_token") !== process.env.STRAVA_VERIFY_TOKEN) {
    return new Response("Invalid token", { status: 403 });
  }

  return NextResponse.json({
    "hub.challenge": searchParams.get("hub.challenge"),
  });
}

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(accountId: number, refreshToken: string) {
  const url =
    "https://www.strava.com/oauth/token?" +
    new URLSearchParams({
      client_id: process.env.STRAVA_CLIENT_ID ?? "",
      client_secret: process.env.STRAVA_CLIENT_SECRET ?? "",
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    method: "POST",
  });

  const refreshedTokens: TokenSet = await response.json();

  if (!response.ok) {
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
        providerAccountId: accountId.toString(),
      },
    },
  });

  return {
    accessToken: refreshedTokens.access_token,
    accessTokenExpires: refreshedTokens.expires_at,
    refreshToken: refreshedTokens.refresh_token ?? refreshToken, // Fall back to old refresh token
  };
}

// Handles webhook events
export async function POST(request: Request) {
  const { owner_id, object_id, object_type, aspect_type } = await request.json();

  if (object_type !== "activity" || aspect_type !== "create") {
    return new Response("", { status: 200 });
  }

  const stravaAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        providerAccountId: owner_id.toString(),
        provider: "strava",
      },
    },
    select: {
      access_token: true,
      refresh_token: true,
      expires_at: true,
    },
  });

  if (!stravaAccount) {
    return new Response("", { status: 200 });
  }

  let accessToken = stravaAccount.access_token;

  if (stravaAccount.expires_at && stravaAccount.expires_at < Math.floor(Date.now() / 1000)) {
    const refreshedTokens = await refreshAccessToken(owner_id, stravaAccount.refresh_token ?? "");
    accessToken = refreshedTokens.accessToken ?? accessToken;
  }

  const activity = await fetch(`https://www.strava.com/api/v3/activities/${object_id}?include_all_efforts=`, {
    headers: {
      Authorization: `Bearer ${stravaAccount.access_token}`,
    },
  });

  const activityData = await activity.json();

  try {
    console.log(activityData);
    const internalActivity = { polyline: activityData.map.polyline, owner_id };

    await fetch("https://hike.aydev.uk/api/strava/activity", {
      method: "POST",
      body: JSON.stringify(internalActivity),
    });

    return new Response("", { status: 200 });
  } catch (e) {
    throw new Error(`${e}\n${JSON.stringify(activityData)}`);
  }
}
