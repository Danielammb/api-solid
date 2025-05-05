import { prisma } from "@/lib/prisma";
import { hash } from "bcryptjs";
import { FastifyInstance } from "fastify";
import request from "supertest";

export const createAndAuthenticateUser = async (
  app: FastifyInstance,
  role?: "ADMIN" | "MEMBER"
) => {
  await prisma.user.create({
    data: {
      name: "John Doe",
      email: "example@mail.com",
      password_hash: await hash("123456", 6),
      role: role ?? "MEMBER",
    },
  });

  const authResponse = await request(app.server).post("/sessions").send({
    email: "example@mail.com",
    password: "123456",
  });
  const { token } = authResponse.body;
  return { token };
};
