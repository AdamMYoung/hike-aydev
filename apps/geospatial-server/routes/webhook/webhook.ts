import { FastifyInstance, RouteShorthandOptions } from "fastify";
import axios from "axios";

import { prisma } from "../../libs/prisma";
import { getFellsOnPolyline } from "../../libs/geo";
import { refreshAccessToken } from "../../libs/strava";

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

    if (!stravaAccount) {
      return;
    }

    let accessToken = stravaAccount.access_token;

    if (stravaAccount.expires_at && stravaAccount.expires_at < Math.floor(Date.now() / 1000)) {
      const refreshedTokens = await refreshAccessToken(owner_id.toString(), stravaAccount.refresh_token ?? "");
      accessToken = refreshedTokens.accessToken ?? accessToken;
    }

    // Get activity of the webhook event.
    const activity = await axios.get(`https://www.strava.com/api/v3/activities/${object_id}?include_all_efforts=`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    // Get all fells from the fetched activity.
    const fellsOnPolyline = await getFellsOnPolyline(activity.data.map.polyline);

    // Insert all matched fells into the database.
    await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: fellsOnPolyline.map((fell) => ({
        fellId: fell.id,
        authorId: stravaAccount.userId,
        climbed: true,
      })),
    });
  });
}
