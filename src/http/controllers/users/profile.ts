// import { FastifyRequest, FastifyReply } from "fastify";
// import { z } from "zod";
// import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";
// import { AuthenticateUseCase } from "@/use-cases/authenticate";
// import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";

import { makeGetUserProfileUseCase } from "@/use-cases/factories/make-get-user-profile-use-case";
import { FastifyReply, FastifyRequest } from "fastify";

export const profile = async (request: FastifyRequest, reply: FastifyReply) => {
  const getUserProfile = makeGetUserProfileUseCase();
  const { user } = await getUserProfile.execute({ userId: request.user.sub });
  return reply.status(200).send({ ...user, password_hash: undefined });
};
