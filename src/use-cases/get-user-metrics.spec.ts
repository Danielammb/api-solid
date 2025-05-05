import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { GetUserMetricsUseCase } from "./get-user-metrics";

let repository: InMemoryCheckInsRepository;
let sut: GetUserMetricsUseCase;
describe("Get User Metrics Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    sut = new GetUserMetricsUseCase(repository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to get check ins count from user metrics", async () => {
    await repository.create({ user_id: "user-1", gym_id: "gym-1" });
    await repository.create({ user_id: "user-1", gym_id: "gym-2" });

    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    const { checkInsCount } = await sut.execute({
      userId: "user-1",
    });
    expect(checkInsCount).toBe(2);
  });
});
