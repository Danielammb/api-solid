import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { CreateGymUseCase } from "./create-gym";

let repository: InMemoryGymsRepository;
let register: CreateGymUseCase;
describe("Create Gym Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository();
    register = new CreateGymUseCase(repository);
  });
  it("should be able to create gym", async () => {
    const { gym } = await register.execute({
      title: "Gym 1",
      latitude: 0,
      longitude: 0,
      description: "Gym 1",
      phone: "123456",
    });

    expect(gym.id).toEqual(expect.any(String));
  });
});
