import { PrismaGymsRepository } from "@/repositories/prisma/prisma-gyms-repository";
import { CheckInUseCase } from "../check-in";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeCheckInUseCase() {
  const repo = new PrismaGymsRepository();
  const checkInRepo = new PrismaCheckInsRepository();
  const useCase = new CheckInUseCase(checkInRepo, repo);
  return useCase;
}
