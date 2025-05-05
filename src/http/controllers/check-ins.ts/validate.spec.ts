import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";
import { prisma } from "@/lib/prisma";

describe("Validate check-in (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to validate a check-in", async () => {
    const { token } = await createAndAuthenticateUser(app, "ADMIN");
    const user = await prisma.user.findFirstOrThrow();
    const gym = await prisma.gym.create({
      data: {
        title: "Javascript gym",
        latitude: -23.55052,
        longitude: -46.633308,
      },
    });
    let checkin = await prisma.checkIn.create({
      data: {
        gym_id: gym.id,
        user_id: user.id,
      },
    });
    const checkInResponse = await request(app.server)
      .patch(`/check-ins/${checkin.id}/validate`)
      .set("Authorization", `Bearer ${token}`)
      .send();

    expect(checkInResponse.statusCode).toEqual(204);
    checkin = await prisma.checkIn.findUniqueOrThrow({
      where: {
        id: checkin.id,
      },
    });
    expect(checkin?.validated_at).toEqual(expect.any(Date));
  });
});
