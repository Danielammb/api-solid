import { CheckIn } from "@prisma/client";
import { CheckInsRepository } from "@/repositories/check-ins-repository";

interface FetchUserCheckInUseCaseRequest {
  userId: string;
  page: number;
}

interface FetchUserCheckInUseCaseResponse {
  checkIns: CheckIn[];
}

export class FetchUserCheckInUseCase {
  constructor(private checkInRepository: CheckInsRepository) {}

  async execute({
    userId,
    page,
  }: FetchUserCheckInUseCaseRequest): Promise<FetchUserCheckInUseCaseResponse> {
    const checkIns = await this.checkInRepository.findManyByUserId(
      userId,
      page
    );

    return { checkIns };
  }
}
