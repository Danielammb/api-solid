import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";

describe("Refresh token (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to refresh token", async () => {
    await request(app.server).post("/users").send({
      name: "John Doe",
      email: "example@mail.com",
      password: "123456",
    });

    const auth = await request(app.server).post("/sessions").send({
      email: "example@mail.com",
      password: "123456",
    });

    const cookies = auth.get("Set-Cookie");

    const response = await request(app.server)
      .patch("/token/refresh")
      .set("Cookie", cookies)
      .send();

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: expect.any(String),
    });
    expect(response.get("Set-cookie")).toEqual([
      expect.stringContaining("refreshToken="),
    ]);
  });
});
