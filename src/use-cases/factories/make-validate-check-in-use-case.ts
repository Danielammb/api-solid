import { ValidateCheckInUseCase } from "../validate-check-in";
import { PrismaCheckInsRepository } from "@/repositories/prisma/prisma-check-ins-repository";

export function makeValidateCheckInUseCase() {
  const repo = new PrismaCheckInsRepository();
  const useCase = new ValidateCheckInUseCase(repo);
  return useCase;
}
