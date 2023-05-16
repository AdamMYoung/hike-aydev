"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// index.ts
var dotenv = __toESM(require("dotenv"));
var import_fastify = __toESM(require("fastify"));

// libs/prisma.ts
var import_database = require("database");
var prisma = new import_database.PrismaClient();

// libs/routes.ts
var import_polyline_codec = require("@googlemaps/polyline-codec");
var import_circle = __toESM(require("@turf/circle"));
var import_helpers = require("@turf/helpers");
var import_line_intersect = __toESM(require("@turf/line-intersect"));

// libs/kv.ts
var import_kv = __toESM(require("@vercel/kv"));
var getCachedEntry = async (key, req) => {
  if (process.env.VERCEL_ENV !== "production") {
    return req();
  }
  const stored = await import_kv.default.get(key);
  if (stored) {
    return stored;
  }
  const request = await req();
  await import_kv.default.set(key, request, { ex: 3600 });
  return request;
};

// libs/requests.ts
var getFellPoints = () => {
  return getCachedEntry(
    "get-fell-points",
    () => prisma.fell.findMany({
      select: {
        id: true,
        lat: true,
        lng: true,
        name: true
      }
    })
  );
};

// libs/routes.ts
var getFellsOnPolyline = async (polyline) => {
  const decodedPolyline = (0, import_polyline_codec.decode)(polyline);
  const points = await getFellPoints();
  const line = (0, import_helpers.lineString)(decodedPolyline);
  const circles = points.map((c) => (0, import_circle.default)([c.lat, c.lng], 0.1, { properties: { id: c.id, name: c.name } }));
  const intersectingCircles = circles.filter((c) => (0, import_line_intersect.default)(c, line).features.length > 0);
  const intersectingIds = intersectingCircles.map((c) => c.properties.id);
  return points.filter((p) => intersectingIds.includes(p.id));
};

// libs/user.ts
var getUserByStravaId = async (stravaId) => {
  return prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        providerAccountId: stravaId,
        provider: "strava"
      }
    },
    select: {
      access_token: true,
      user: {
        select: {
          id: true,
          name: true
        }
      }
    }
  });
};

// routes/activities/activities.ts
var stravaOpts = {
  schema: {
    body: {
      type: "object",
      properties: {
        polyline: { type: "string" },
        ownerId: { type: "string" }
      }
    }
  }
};
async function routes(fastify2, options) {
  fastify2.post("/activities/manual", async (request, reply) => {
    return { hello: "world" };
  });
  fastify2.post("/activities/strava", stravaOpts, async (request, reply) => {
    const { polyline, ownerId } = request.body;
    const stravaAccount = await getUserByStravaId(ownerId);
    if (!stravaAccount) {
      reply.status(401).send();
      return;
    }
    const fellsOnPolyline = await getFellsOnPolyline(polyline);
    await prisma.logEntry.createMany({
      skipDuplicates: true,
      data: fellsOnPolyline.map((fell) => ({
        fellId: fell.id,
        authorId: stravaAccount.user.id,
        climbed: true
      }))
    });
    reply.send();
  });
}

// index.ts
dotenv.config();
var fastify = (0, import_fastify.default)({
  logger: true
});
fastify.get("/health", (req, reply) => {
  reply.status(200).send();
});
fastify.register((instance, opts, done) => {
  instance.addHook("preHandler", (req, reply, done2) => {
    if (req) {
      if (req.headers["x-api-key"] === process.env.GEOSPATIAL_API_KEY) {
        done2();
        return;
      }
    }
    reply.status(401).send();
  });
  instance.register(routes);
  done();
});
var start = async () => {
  try {
    await fastify.listen({ port: 4e3 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
//# sourceMappingURL=index.js.map