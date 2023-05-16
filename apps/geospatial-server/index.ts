// ESM
import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { routes as activities } from "./activities";

const fastify = Fastify({
  logger: true,
});

fastify.addHook("preHandler", (req, reply, done) => {
  if (req.headers["x-api-key"] === process.env.GEOSPATIAL_API_KEY) {
    done();
    return;
  }

  reply.status(401).send();
});

fastify.get("/health", (req, reply) => {
  reply.status(200).send();
});

fastify.register(activities);

/**
 * Run the server!
 */
const start = async () => {
  try {
    await fastify.listen({ port: 3000 });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
