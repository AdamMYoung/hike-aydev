import { FastifyInstance, RouteShorthandOptions } from "fastify";

import { prisma } from "../libs/prisma";
import { getFellPoints } from "../libs/requests";
import { decode } from "@googlemaps/polyline-codec";

import circle from "@turf/circle";
import { lineString } from "@turf/helpers";
import lineIntersect from "@turf/line-intersect";

const stravaOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      properties: {
        polyline: { type: "string" },
        owner_id: { type: "number" },
      },
    },
  },
};

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.post("/activities/manual", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.post("/activities/strava", stravaOpts, async (request, reply) => {
    const { polyline, owner_id } = request.body as any;

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
      reply.statusCode = 401;
      reply.send();
      return;
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

    reply.send();
  });
}
