// ESM
import "isomorphic-fetch";
import * as dotenv from "dotenv";
import Fastify from "fastify";

import cookie from "@fastify/cookie";
import multipart from "@fastify/multipart";

import { routes as activities } from "./routes/activities";
import { routes as strava } from "./routes/strava";
import { routes as webhook } from "./routes/webhook";

dotenv.config();

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
    await fastify.listen({ port: 4000, host: process.env.RUNTIME_ENV === "production" ? "0.0.0.0" : undefined });
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
