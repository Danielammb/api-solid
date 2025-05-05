import { GetUserMetricsUseCase } from "../get-user-metrics";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeGetUserMetricsUseCase() {
  const repo = new PrismaCheckInsRepository();
  const useCase = new GetUserMetricsUseCase(repo);
  return useCase;
}
