import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { hash } from "bcryptjs";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";
import { CheckInUseCase } from "./check-in";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins-repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { Decimal } from "@prisma/client/runtime/library";

let repository: InMemoryCheckInsRepository;
let gymsRepository: InMemoryGymsRepository;
let sut: CheckInUseCase;
describe("CheckIn Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryCheckInsRepository();
    gymsRepository = new InMemoryGymsRepository();
    sut = new CheckInUseCase(repository, gymsRepository);
    vi.useFakeTimers();
    gymsRepository.gyms.push({
      id: "gym-1",
      title: "Gym 1",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      description: "Gym 1",
      phone: "123456",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("should be able to check in", async () => {
    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    const { checkIn } = await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should be able to check in twice in the same day", async () => {
    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });
    await expect(
      async () =>
        await sut.execute({
          userId: "user-1",
          gymId: "gym-1",
          userLatitude: 0,
          userLongitude: 0,
        })
    ).rejects.toThrowError(Error);
  });

  it("should be able to check in twice but in different days", async () => {
    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });
    vi.setSystemTime(new Date("2021-01-02T10:00:00"));
    const { checkIn } = await sut.execute({
      userId: "user-1",
      gymId: "gym-1",
      userLatitude: 0,
      userLongitude: 0,
    });
    expect(checkIn.id).toEqual(expect.any(String));
  });

  it("should not be able to check in on distant gym", async () => {
    gymsRepository.gyms.push({
      id: "gym-1",
      title: "Gym 1",
      latitude: new Decimal(12.2753853),
      longitude: new Decimal(-69.1196819),
      description: "Gym 1",
      phone: "123456",
    });

    vi.setSystemTime(new Date("2021-01-01T10:00:00"));
    await expect(async () => {
      await sut.execute({
        userId: "user-1",
        gymId: "gym-1",
        userLatitude: 12.2448605,
        userLongitude: -69.0642601,
      });
    }).rejects.toThrowError(Error);
  });
});
