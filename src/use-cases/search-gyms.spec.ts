import { expect, describe, it, beforeEach } from "vitest";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms-repository";
import { SearchGymsUseCase } from "./search-gyms";
import { Decimal } from "@prisma/client/runtime/library";

let repository: InMemoryGymsRepository;
let register: SearchGymsUseCase;
describe("Search Gym Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryGymsRepository();
    register = new SearchGymsUseCase(repository);
    repository.gyms.push({
      id: "gym-1",
      title: "Gym 1",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      description: "Gym 1",
      phone: "123456",
    });
    repository.gyms.push({
      id: "gym-2",
      title: "Gym 2",
      latitude: new Decimal(0),
      longitude: new Decimal(0),
      description: "Gym 2",
      phone: "1234446",
    });
  });
  it("should be able to search gyms", async () => {
    const query = "Gym";
    const { gyms } = await register.execute({ query, page: 1 });
    expect(gyms).toHaveLength(2);
  });
});
