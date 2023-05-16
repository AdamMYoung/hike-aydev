// ESM
import * as dotenv from "dotenv";
dotenv.config();

import Fastify from "fastify";
import { routes as activities } from "./activities";

const fastify = Fastify({
  logger: true,
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
