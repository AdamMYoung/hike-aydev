import { prisma } from "@/libs/prisma";
import { getFellPoints } from "@/libs/requests";
import { decode } from "@googlemaps/polyline-codec";
import { NextResponse } from "next/server";

import circle from "@turf/circle";
import { lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";
import lineOverlap from "@turf/line-overlap";

// Handles webhook events
export async function POST(request: Request) {
  const { polyline, owner_id } = await request.json();

  const stravaAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        providerAccountId: owner_id.toString(),
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

  if (!stravaAccount) {
    return new Response("", { status: 200 });
  }

  const decodedPolyline = decode(polyline);
  const points = await getFellPoints();

  const line = lineString(decodedPolyline);
  const circles = points.map((c) => circle([c.lat, c.lng], 0.1, { properties: { id: c.id, name: c.name } }));

  const intersectingCircles = circles.filter((c) => lineIntersect(c, line).features.length > 0);
  const intersectingIds = intersectingCircles.map((c) => c.properties.id);

  await prisma.logEntry.createMany({
    skipDuplicates: true,
    data: intersectingIds.map((id) => ({
      fellId: id,
      authorId: stravaAccount.user.id,
      climbed: true,
    })),
  });

  return new Response("", { status: 200 });
}