import { XMLParser } from "fast-xml-parser";
import { FastifyInstance } from "fastify";

import { lineString } from "@turf/helpers";

import { getFellsOnLineString } from "../../libs/geo";
import { getUserSession } from "../../libs/user";
import { LogSource, prisma } from "database";
import { encode } from "@googlemaps/polyline-codec";

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.post("/activities/manual", async (request, reply) => {
    const user = await getUserSession(request);

    if (!user) {
      reply.status(401).send();
      return;
    }

    const file = await request.file();

    // Verify file exists
    if (!file || !file.filename.endsWith(".gpx")) {
      reply.status(400).send();
      return;
    }

    // Parse XML
    const parser = new XMLParser({ ignoreAttributes: false });

    const fileStringData = (await file.toBuffer()).toString();
    const parsedGpxFile = parser.parse(fileStringData);

    // Extract matched values
    const date = new Date(parsedGpxFile.gpx.metadata.time);
    const { trkseg } = parsedGpxFile.gpx.trk;

    const points: [number, number][] = trkseg.trkpt.map((t: any) => [parseFloat(t["@_lon"]), parseFloat(t["@_lat"])]);

    // Parse coordinates and get matching fells.
    const matchedFells = await getFellsOnLineString(lineString(points));

    const upsetGroupResult = await prisma.logGroup.upsert({
      where: {
        start_authorId: {
          start: date,
          authorId: user.id,
        },
      },
      create: {
        authorId: user.id,
        start: date,
        source: LogSource.MANUAL,
        polyline: encode(points),
      },
      update: {},
    });

    // Insert all matched fells into the database.
    const createManyResult = await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: matchedFells.map((fell) => ({
        logGroupId: upsetGroupResult.id,
        fellId: fell.id,
        authorId: user.id,
        climbed: true,
      })),
    });

    reply.status(201).send({
      total: matchedFells.length,
      inserted: createManyResult.count,
    });
  });
}
