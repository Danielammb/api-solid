import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { makeFetchNearbyGymsUseCase } from "@/use-cases/factories/make-fetch-nearby-gyms-use-case";

export const nearby = async (request: FastifyRequest, reply: FastifyReply) => {
  const nearByGymQuerySchema = z.object({
    latitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 90;
    }),
    longitude: z.coerce.number().refine((value) => {
      return Math.abs(value) <= 180;
    }),
    page: z.coerce.number().default(1),
  });

  const { latitude, longitude, page } = nearByGymQuerySchema.parse(
    request.query
  );

  const searchUseCase = makeFetchNearbyGymsUseCase();
  const { gyms } = await searchUseCase.execute({
    userLatitude: latitude,
    userLongitude: longitude,
    page,
  });

  return reply.status(200).send({ gyms });
};
