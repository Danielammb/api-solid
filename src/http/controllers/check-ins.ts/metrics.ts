import { FastifyRequest, FastifyReply } from "fastify";
import { makeGetUserMetricsUseCase } from "@/use-cases/factories/make-get-user-metrics-use-case";

export const metrics = async (request: FastifyRequest, reply: FastifyReply) => {
  const metricsUseCase = makeGetUserMetricsUseCase();
  const { checkInsCount } = await metricsUseCase.execute({
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkInsCount });
};
