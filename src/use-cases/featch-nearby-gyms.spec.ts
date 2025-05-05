import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let repository: InMemoryGymsRepository;
let sut: FetchNearbyGymsUseCase;
describe("Fetch Nearby Gyms Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository();
    sut = new FetchNearbyGymsUseCase(repository);
    vi.useFakeTimers();
    repository.gyms.push({
      id: "gym-1",
      title: "Gym 1",
      latitude: new Decimal(12.1422147),
      longitude: new Decimal(-68.8300538),
      description: "Gym 1",
      phone: "123456",
    });
    repository.gyms.push({
      id: "gym-2",
      title: "Gym 2",
      latitude: new Decimal(12.063537),
      longitude: new Decimal(-68.9138518),
      description: "Gym 2",
      phone: "1234446",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to fetch nearby gyms", async () => {
    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    const { gyms } = await sut.execute({
      userLatitude: 12.1452877,
      userLongitude: -68.8213313,
      page: 1,
    });
    expect(gyms).toHaveLength(1);
    expect(gyms).toEqual([expect.objectContaining({ id: "gym-1" })]);
  });
});
