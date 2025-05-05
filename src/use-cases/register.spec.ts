import { expect, describe, it, beforeEach } from "vitest";
import { RegisterUseCase } from "./register";
import bcrypt from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

let repository: InMemoryUsersRepository;
let register: RegisterUseCase;
describe("Register Use Case", () => {
  beforeEach(() => {
    repository = new InMemoryUsersRepository();
    register = new RegisterUseCase(repository);
  });
  it("should be able to register", async () => {
    const { user } = await register.execute({
      name: "John Doe",
      email: "example@email.com",
      password: "123456",
    });

    expect(user.id).toEqual(expect.any(String));
  });
  it("should hash user password upon registration", async () => {
    const { user } = await register.execute({
      name: "John Doe",
      email: "example@email.com",
      password: "123456",
    });

    const isPasswordHashValid = await bcrypt.compare(
      "123456",
      user.password_hash
    );

    expect(isPasswordHashValid).toBe(true);
  });

  it("should not be able to register with same email twice", async () => {
    const email = "example@email.com";

    await register.execute({
      name: "John Doe",
      email,
      password: "123456",
    });

    await expect(async () => {
      await register.execute({
        name: "John Doe",
        email,
        password: "123456",
      });
    }).rejects.toBeInstanceOf(UserAlreadyExistsError);
  });
});
