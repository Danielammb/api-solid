import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { FetchNearbyGymsUseCase } from "../fetch-nearby-gyms";

export function makeFetchNearbyGymsUseCase() {
  const repo = new PrismaGymsRepository();
  const useCase = new FetchNearbyGymsUseCase(repo);
  return useCase;
}
