import { describe, it, expect, beforeEach } from "vitest";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";
import { GetUserProfileUseCase } from "./get-user-profile";
import { ResourceNotFoundError } from "./errors/resource-not-found-error";

let repository: InMemoryUsersRepository;
let sut: GetUserProfileUseCase;
describe("GetUserProfile Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
    sut = new GetUserProfileUseCase(repository);
  });
  it("should be able to get user profile", async () => {
    repository.create({
      name: "John Doe",
      email: "example@email.com",
      password_hash: await hash("123456", 6),
    });
    const { user } = await sut.execute({
      userId: "user-1",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to get user profile", async () => {
    repository.create({
      name: "John Doe",
      email: "example@email.com",
      password_hash: await hash("123456", 6),
    });

    await expect(async () => {
      await sut.execute({
        userId: "user-2",
      });
    }).rejects.toBeInstanceOf(ResourceNotFoundError);
  });
});
