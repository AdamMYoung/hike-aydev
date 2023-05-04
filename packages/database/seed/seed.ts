import { promises as fs } from "fs";
import neatCsv from "neat-csv";
import { PrismaClient } from "@prisma/client";

const client = new PrismaClient();

/**
 *  id             Int         @id @default(autoincrement())
  name           String      @unique
  description    String?
  imageUrl       String?
  metres         Int
  feet           Int
  xCoord         Float
  yCoord         Float
  gridReference  String
  hillBaggingUrl String
 */

const groups = [
  {
    name: "P600s",
    description: "",
    country: "British Isles",
    classification: "P600",
  },
  {
    name: "Wainwrights",
    description: "",
    country: "England",
    classification: "W",
  },
  {
    name: "Birketts",
    description: "",
    country: "England",
    classification: "B",
  },
  {
    name: "Synges",
    description: "",
    country: "England",
    classification: "Sy",
  },
  {
    name: "Munros",
    description: "",
    country: "Scotland",
    classification: "M",
  },
  {
    name: "Corbetts",
    description: "",
    country: "Scotland",
    classification: "C",
  },
  {
    name: "Donalds",
    description: "",
    country: "Scotland",
    classification: "D",
  },
];

const run = async () => {
  const csvData = await fs.readFile("seed/DoBIH_v17_5.csv");
  const csvRecords = await neatCsv(csvData);

  const fellData = csvRecords.map((rec) => {
    let classification = rec.Classification.split(",");

    if (parseInt(rec.Metres) > 600) {
      classification = [...classification, "P600"];
    }

    return {
      id: parseInt(rec.Number),
      name: rec.Name,
      metres: parseInt(rec.Metres),
      feet: parseInt(rec.Feet),
      lat: parseFloat(rec.Latitude),
      lng: parseFloat(rec.Longitude),
      gridReference: rec.GridrefXY,
      classification,
      hillBaggingUrl: rec["Hill-bagging"],
    };
  });

  const totalClassifications = groups.map((g) => g.classification);
  const fellEntries = fellData.filter((d) => d.classification.find((c) => totalClassifications.includes(c)));

  await client.fell.createMany({
    skipDuplicates: true,
    data: fellEntries.map((f) => ({
      id: f.id,
      name: f.name,
      metres: f.metres,
      feet: f.feet,
      gridReference: f.gridReference,
      hillBaggingUrl: f.hillBaggingUrl,
      lat: f.lat,
      lng: f.lng,
    })),
  });

  await Promise.all(
    groups.map(async (g) => {
      const groupFellIds = fellEntries.filter((f) => f.classification.includes(g.classification)).map((f) => f.id);

      return await client.fellGroup.upsert({
        where: {
          name: g.name,
        },
        create: {
          name: g.name,
          description: g.description,
          fells: { connect: groupFellIds.map((id) => ({ id })) },
        },
        update: {},
      });
    })
  );
};

run();
