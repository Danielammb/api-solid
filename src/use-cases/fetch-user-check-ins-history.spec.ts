import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { FetchUserCheckInUseCase } from "./fetch-user-check-ins-history";

let repository: InMemoryCheckInsRepository;
let sut: FetchUserCheckInUseCase;
describe("Fetch User Check In Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    sut = new FetchUserCheckInUseCase(repository);
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to fetch check-in history", async () => {
    await repository.create({ user_id: "user-1", gym_id: "gym-1" });
    await repository.create({ user_id: "user-1", gym_id: "gym-2" });

    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 1,
    });
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-1" }),
      expect.objectContaining({ gym_id: "gym-2" }),
    ]);
  });

  it("should be able to fetch paginated check-in history", async () => {
    for (let i = 0; i < 22; i++) {
      await repository.create({ user_id: "user-1", gym_id: `gym-${i + 1}` });
    }

    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    const { checkIns } = await sut.execute({
      userId: "user-1",
      page: 2,
    });
    expect(checkIns).toHaveLength(2);
    expect(checkIns).toEqual([
      expect.objectContaining({ gym_id: "gym-21" }),
      expect.objectContaining({ gym_id: "gym-22" }),
    ]);
  });
});
