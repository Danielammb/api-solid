import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeSearchGymsUseCase } from "@/use-cases/factories/make-search-gyms-use-case";

export const search = async (request: FastifyRequest, reply: FastifyReply) => {
  const searchGymQuerySchema = z.object({
    query: z.string(),
    page: z.coerce.number().default(1),
  });

  const { query, page } = searchGymQuerySchema.parse(request.query);

  const searchUseCase = makeSearchGymsUseCase();
  const { gyms } = await searchUseCase.execute({
    query,
    page,
  });

  return reply.status(200).send({ gyms });
};
