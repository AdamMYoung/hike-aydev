// ESM
import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import multipart from "@fastify/multipart";

import { routes as activities } from "./routes/activities";
import { routes as webhook } from "./routes/webhook";

const fastify = Fastify({
  logger: true,
});

fastify.register(multipart);

// Health check endpoint
fastify.get("/health", (req, reply) => {
  reply.status(200).send();
});

// Strava webhook routes
fastify.register(webhook);

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
    await fastify.listen({ port: 4000, host: process.env.NODE_ENV === "production" ? "0.0.0.0" : undefined });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
