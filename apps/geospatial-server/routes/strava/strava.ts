import axios from "axios";
import { FastifyInstance } from "fastify";

import { getFellsOnPolyline } from "../../libs/geo";
import { getStravaAccessToken, getUserSession } from "../../libs/user";
import { prisma, constants, LogSource } from "database";

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.post("/strava/history", async (request, reply) => {
    request.log.info("Starting Strava history sync request");
    const user = await getUserSession(request);

    if (!user) {
      reply.status(401).send();
      return;
    }

    const timeouts = await prisma.userEventTimeout.findFirst({
      where: { userId: user.id, event: constants.GET_STRAVA_HISTORY_EVENT },
    });

    if (timeouts && timeouts.expires.getTime() > Date.now()) {
      reply.status(400).send("Event in timeout, try again later");
      return;
    }

    // Get user.
    const stravaAccount = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: "strava",
      },
      select: {
        access_token: true,
        refresh_token: true,
        expires_at: true,
        providerAccountId: true,
      },
    });

    if (!stravaAccount || !stravaAccount.access_token || !stravaAccount.refresh_token || !stravaAccount.expires_at) {
      reply.status(401).send("Not logged in with via Strava provider");
      request.log.warn(`No user found with ID ${user.id}`);
      return;
    }

    request.log.info("Found user with ID", user.id);

    await prisma.userEventTimeout.create({
      data: {
        userId: user.id,
        event: constants.GET_STRAVA_HISTORY_EVENT,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 Day,
      },
    });

    request.log.info(`Created user event timeout for user ${user.id}`);

    reply.status(200).send("Processing routes");

    const accessToken = await getStravaAccessToken({
      stravaId: stravaAccount.providerAccountId,
      accessToken: stravaAccount.access_token,
      refreshToken: stravaAccount.refresh_token,
      expiresAt: stravaAccount.expires_at,
    });

    // Build a list of all possible activities.

    const activities = [];

    let page = 1;
    let atEndOfList = false;

    while (!atEndOfList) {
      const activity = await axios.get(`https://www.strava.com/api/v3/athlete/activities?per_page=200&page=${page}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (activity.data.length === 0) {
        atEndOfList = true;
        continue;
      }

      activities.push(...activity.data);
      page += 1;
    }

    request.log.info(`Found ${activities.length} activities for user ${user.id}`);

    const mappedActivities = await Promise.all(
      activities
        .filter((a) => a.map.summary_polyline)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        .map(async (activity) => {
          const start = new Date(activity.start_date);
          const end = new Date(start.getTime() + activity.elapsed_time * 1000);
          const polyline = activity.map.summary_polyline as string;
          const fells = await getFellsOnPolyline(polyline);

          request.log.info(`Found ${fells.length} fells for user ${user.id} in activity ${activity.id}`);

          return { start, end, polyline, fells };
        })
    );

    await Promise.all(
      mappedActivities
        .filter((a) => a.fells.length > 0)
        .map(async ({ start, end, polyline, fells }) => {
          const upsetGroupResult = await prisma.logGroup.upsert({
            where: { start_authorId: { start, authorId: user.id } },
            create: {
              authorId: user.id,
              start,
              end,
              source: LogSource.STRAVA,
              polyline,
            },
            update: {},
          });

          // Insert all matched fells into the database.
          return prisma.logEntry.createMany({
            skipDuplicates: true,
            data: fells.map((fell) => ({
              logGroupId: upsetGroupResult.id,
              fellId: fell.id,
              authorId: user.id,
              climbed: true,
            })),
          });
        })
    );

    request.log.info("Successfully synced strava history");
  });
}
