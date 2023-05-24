import axios from 'axios';
import { FastifyInstance } from 'fastify';

import { getFellsOnPolyline } from '../../libs/geo';
import { prisma } from '../../libs/prisma';
import { FellPoint } from '../../libs/requests';
import { getStravaAccessToken, getUserSession } from '../../libs/user';

const GET_STRAVA_HISTORY_EVENT = "GET_STRAVA_HISTORY";

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.post("/strava/history", async (request, reply) => {
    const user = await getUserSession(request);

    if (!user) {
      reply.status(401).send();
      return;
    }

    const timeouts = await prisma.userEventTimeout.findFirst({
      where: {
        userId: user.id,
        event: GET_STRAVA_HISTORY_EVENT,
      },
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
      return;
    }

    await prisma.userEventTimeout.create({
      data: {
        userId: user.id,
        event: GET_STRAVA_HISTORY_EVENT,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24), // 1 Day,
      },
    });

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

    const completedFells: { fell: FellPoint; date: Date }[] = [];

    await Promise.all(
      activities
        .filter((a) => a.map.summary_polyline)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
        .map(async (activity) => {
          const date = new Date(activity.start_date);
          const fells = await getFellsOnPolyline(activity.map.summary_polyline);

          fells.forEach((fell) => {
            completedFells.push({ date, fell });
          });
        })
    );

    await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: completedFells.map(({ fell, date }) => ({
        fellId: fell.id,
        authorId: user.id,
        date,
        climbed: true,
      })),
    });
  });
}
