import axios from "axios";
import { FastifyInstance, RouteShorthandOptions } from "fastify";

import { getFellsOnPolyline } from "../../libs/geo";

import { getStravaAccessToken } from "../../libs/user";
import { clearTimelineCache, LogSource, prisma } from "database";

const stravaWebhookGetSchema: RouteShorthandOptions = {
  schema: {
    querystring: {
      properties: {
        "hub.verify_token": { type: "string" },
        "hub.challenge": { type: "string" },
      },
    },
  },
};

const stravaWebhookPostSchema: RouteShorthandOptions = {
  schema: {
    body: {
      type: "object",
      properties: {
        owner_id: { type: "number" },
        object_id: { type: "number" },
        object_type: { type: "string" },
        aspect_type: { type: "string" },
      },
    },
  },
};

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.get("/webhook/strava", stravaWebhookGetSchema, async (request, reply) => {
    const verifyToken = (request.query as any)["hub.verify_token"];
    const challenge = (request.query as any)["hub.challenge"];

    if (verifyToken !== process.env.STRAVA_VERIFY_TOKEN) {
      reply.status(403).send("Invalid token");
      return;
    }

    reply.status(200).send({
      "hub.challenge": challenge,
    });
  });

  fastify.post("/webhook/strava", stravaWebhookPostSchema, async (request, reply) => {
    const { owner_id, object_id, object_type, aspect_type } = request.body as any;
    request.log.info(`Starting new webhook request for user ${owner_id}`);

    reply.status(200).send("OK");

    if (object_type !== "activity" || aspect_type !== "create") {
      return;
    }

    // Get user.
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
        userId: true,
      },
    });

    if (!stravaAccount || !stravaAccount.access_token || !stravaAccount.refresh_token || !stravaAccount.expires_at) {
      request.log.warn(`No user found with ID ${owner_id}`);
      return;
    }

    request.log.info(`Found user with ID ${owner_id}`);

    const accessToken = await getStravaAccessToken({
      stravaId: stravaAccount.userId,
      accessToken: stravaAccount.access_token,
      refreshToken: stravaAccount.refresh_token,
      expiresAt: stravaAccount.expires_at,
    });

    // Get activity of the webhook event.
    const activity = await axios.get(`https://www.strava.com/api/v3/activities/${object_id}?include_all_efforts=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const start = new Date(activity.data.start_date);
    const end = new Date(start.getTime() + activity.data.elapsed_time * 1000);

    start.setHours(0, 0, 0, 0);
    // Get all fells from the fetched activity.
    const fellsOnPolyline = await getFellsOnPolyline(activity.data.map.summary_polyline);

    request.log.info(`Found ${fellsOnPolyline.length} fells for user ${owner_id} in activity ${object_id}`);

    const upsetGroupResult = await prisma.logGroup.upsert({
      where: { start_authorId: { start, authorId: stravaAccount.userId } },
      create: {
        authorId: stravaAccount.userId,
        start,
        end,
        source: LogSource.STRAVA,
        polyline: activity.data.map.summary_polyline,
      },
      update: {},
    });

    // Insert all matched fells into the database.
    await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: fellsOnPolyline.map((fell) => ({
        fellId: fell.id,
        authorId: stravaAccount.userId,
        logGroupId: upsetGroupResult.id,
        climbed: true,
      })),
    });

    clearTimelineCache(stravaAccount.userId);

    request.log.info("Successfully fetched fells from webhook request");
  });
}
