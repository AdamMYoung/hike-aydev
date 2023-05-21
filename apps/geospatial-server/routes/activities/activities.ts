import { FastifyInstance } from "fastify";
import { XMLParser } from "fast-xml-parser";
import { lineString } from "@turf/helpers";

import { getFellsOnLineString } from "../../libs/geo";
import { prisma } from "../../libs/prisma";
import { getUserSession } from "../../libs/user";

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

    // Insert all matched fells into the database.
    const createManyResult = await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: matchedFells.map((fell) => ({
        fellId: fell.id,
        authorId: user.id,
        climbed: true,
        date,
      })),
    });

    reply.status(201).send({
      total: matchedFells.length,
      inserted: createManyResult.count,
    });
  });
}
