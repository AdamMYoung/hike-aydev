import { FastifyInstance } from "fastify";
import { XMLParser } from "fast-xml-parser";
import { lineString } from "@turf/helpers";

import { getFellsOnLineString } from "../../libs/routes";
import { prisma } from "../../libs/prisma";

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.post("/activities/manual/:id", async (request, reply) => {
    console.time(request.id);

    const { id: userId } = request.params as { id: string };
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

    reply.status(201).send();

    // Extract matched values
    const date = new Date(parsedGpxFile.gpx.metadata.time);
    const { trkseg } = parsedGpxFile.gpx.trk;

    const points: [number, number][] = trkseg.trkpt.map((t: any) => [parseFloat(t["@_lon"]), parseFloat(t["@_lat"])]);

    // Parse coordinates and get matching fells.
    const matchedFells = await getFellsOnLineString(lineString(points));

    // Insert all matched fells into the database.
    await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: matchedFells.map((fell) => ({
        fellId: fell.id,
        authorId: userId,
        climbed: true,
        date,
      })),
    });
  });
}
