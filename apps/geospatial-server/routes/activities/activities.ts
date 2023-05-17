import { FastifyInstance } from "fastify";

export async function routes(fastify: FastifyInstance, options: object) {
  fastify.post("/activities/manual", async (request, reply) => {
    return { hello: "world" };
  });
}
