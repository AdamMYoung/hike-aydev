// ESM
import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import multipart from "@fastify/multipart";
import cookie from "@fastify/cookie";

import { routes as activities } from "./routes/activities";
import { routes as webhook } from "./routes/webhook";
import { routes as strava } from "./routes/strava";

const fastify = Fastify({ logger: true });

fastify.register(cookie);
fastify.register(multipart, {
  limits: { fileSize: 10000000 },
});

// Health check endpoint
fastify.get("/health", { logLevel: "silent" }, (req, reply) => {
  reply.status(200).send();
});

// Application routes
fastify.register(webhook);
fastify.register(activities);
fastify.register(strava);

const start = async () => {
  try {
    await fastify.listen({ port: 4000, host: process.env.NODE_ENV === "production" ? "0.0.0.0" : undefined });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
