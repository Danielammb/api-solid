import { FetchUserCheckInUseCase } from "../fetch-user-check-ins-history";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeFetchCheckInHistoryUseCase() {
  const repo = new PrismaCheckInsRepository();
  const useCase = new FetchUserCheckInUseCase(repo);
  return useCase;
}
