import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { ValidateCheckInUseCase } from "./validate-check-in";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let repository: InMemoryCheckInsRepository;
let sut: ValidateCheckInUseCase;
describe("Validate CheckIn Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    sut = new ValidateCheckInUseCase(repository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to validate check-in", async () => {
    const CheckIn = await repository.create({
      user_id: "user-1",
      gym_id: "gym-1",
    });
    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    const { checkIn } = await sut.execute({
      checkInId: CheckIn.id,
    });
    expect(checkIn.id).toEqual(CheckIn.id);
    expect(checkIn.validated_at).toEqual(expect.any(Date));
  });

  it("should not be able to validate an inexistent check-in", async () => {
    const inexistentCheckInId = "inexistent-check-in-id";
    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    await expect(async () => {
      await sut.execute({
        checkInId: inexistentCheckInId,
      });
    }).rejects.toThrowError(ResourceNotFoundError);
  });

  it("should not be able to validate a check-in after 20 minutes of its creation", async () => {
    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    const CheckIn = await repository.create({
      user_id: "user-1",
      gym_id: "gym-1",
    });
    const twentyOneMinutesInMs = 1000 * 60 * 21;
    vi.advanceTimersByTime(twentyOneMinutesInMs);

    await expect(async () => {
      await sut.execute({
        checkInId: CheckIn.id,
      });
    }).rejects.toThrowError(Error);
  });
});
