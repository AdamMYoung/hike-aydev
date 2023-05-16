// ESM
import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { routes as activities } from "./routes/activities";

const fastify = Fastify({
  logger: true,
});

// Health check endpoint
fastify.get("/health", (req, reply) => {
  reply.status(200).send();
});

// Application routes
fastify.register((instance, opts, done) => {
  instance.addHook("preHandler", (req, reply, done) => {
    if (req)
      if (req.headers["x-api-key"] === process.env.GEOSPATIAL_API_KEY) {
        done();
        return;
      }

    reply.status(401).send();
  });

  instance.register(activities);
  done();
});

/**
 * Run the server!
 */
const start = async () => {
  try {
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    await fastify.listen({ host: "localhost", port: parseInt(process.env.PORT || "4000") });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
