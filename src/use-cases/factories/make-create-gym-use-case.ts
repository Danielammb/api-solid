import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CreateGymUseCase } from "../create-gym";

export function makeCreateGymUseCase() {
  const repo = new PrismaGymsRepository();
  const useCase = new CreateGymUseCase(repo);
  return useCase;
}
