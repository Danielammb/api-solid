import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { SearchGymsUseCase } from "../search-gyms";

export function makeSearchGymsUseCase() {
  const repo = new PrismaGymsRepository();
  const useCase = new SearchGymsUseCase(repo);
  return useCase;
}
