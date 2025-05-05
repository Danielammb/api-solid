import { describe, it, expect, beforeEach } from "vitest";
import { AuthenticateUseCase } from "./authenticate";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { hash } from "bcryptjs";
import { InvalidCredentialsError } from "./errors/invalid-credentials-error";

let repository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;
describe("Authenticate Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
    sut = new AuthenticateUseCase(repository);
  });
  it("should authenticate with valid credentials", async () => {
    repository.create({
      name: "John Doe",
      email: "example@email.com",
      password_hash: await hash("123456", 6),
    });
    const { user } = await sut.execute({
      email: "example@email.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });

  it("should not be able to authenticate with invalid email", async () => {
    repository.create({
      name: "John Doe",
      email: "example@email.com",
      password_hash: await hash("123456", 6),
    });

    await expect(async () => {
      await sut.execute({
        email: "example234@email.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("should not be able to authenticate with invalid password", async () => {
    repository.create({
      name: "John Doe",
      email: "example@email.com",
      password_hash: await hash("123456", 6),
    });

    await expect(async () => {
      await sut.execute({
        email: "example@email.com",
        password: "123123",
      });
    }).rejects.toBeInstanceOf(InvalidCredentialsError);
  });
});
