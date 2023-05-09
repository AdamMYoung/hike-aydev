import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const body = await request.json();

  return NextResponse.json({
    "hub.challenge": body["hub.challenge"],
    "hub.verify_token": process.env.STRAVA_VERIFY_TOKEN ?? "",
  });
}

// Handles webhook events
export async function POST(request: Request) {
  const { owner_id, object_id, object_type, aspect_type } = await request.json();

  if (object_type !== "activity" || aspect_type !== "create") {
    return NextResponse.next();
  }

  const stravaAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: owner_id,
    },
    select: {
      access_token: true,
    },
  });

  if (!stravaAccount) {
    return NextResponse.next();
  }

  const activity = await fetch(`https://www.strava.com/api/v3/activities/${object_id}?include_all_efforts=`, {
    headers: {
      Authorization: `Bearer ${stravaAccount.access_token}`,
    },
  });

  const activityData = await activity.json();
  const internalActivity = { polyline: activityData.map.polyline, owner_id };

  fetch("/api/strava/activity", { method: "POST", body: JSON.stringify(internalActivity) });

  return NextResponse.next();
}
