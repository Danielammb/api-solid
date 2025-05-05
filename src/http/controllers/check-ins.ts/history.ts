import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchCheckInHistoryUseCase } from "@/use-cases/factories/make-fetch-checkin-history-use-case";

export const history = async (request: FastifyRequest, reply: FastifyReply) => {
  const checkInHistoryQuerySchema = z.object({
    page: z.coerce.number().default(1),
  });

  const { page } = checkInHistoryQuerySchema.parse(request.query);

  const historyUseCase = makeFetchCheckInHistoryUseCase();
  const { checkIns } = await historyUseCase.execute({
    page,
    userId: request.user.sub,
  });

  return reply.status(200).send({ checkIns });
};
