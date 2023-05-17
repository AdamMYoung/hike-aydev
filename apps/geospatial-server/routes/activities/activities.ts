import { FastifyInstance, RouteShorthandOptions } from "fastify";

import { prisma } from "../../libs/prisma";
import { getFellsOnPolyline } from "../../libs/routes";
import { getUserByStravaId } from "../../libs/user";

const stravaOpts: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      properties: {
        polyline: { type: "string" },
        ownerId: { type: "string" },
      },
    },
  },
};

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.post("/activities/manual", async (request, reply) => {
    return { hello: "world" };
  });

  fastify.post("/activities/strava", stravaOpts, async (request, reply) => {
    const { polyline, ownerId } = request.body as { polyline: string; ownerId: string };

    const stravaAccount = await getUserByStravaId(ownerId);

    reply.status(200).send();

    if (!stravaAccount) {
      return;
    }

    const fellsOnPolyline = await getFellsOnPolyline(polyline);

    await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: fellsOnPolyline.map((fell) => ({
        fellId: fell.id,
        authorId: stravaAccount.user.id,
        climbed: true,
      })),
    });
  });
}
