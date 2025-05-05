import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Nearby gyms (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to list nearby gyms", async () => {
    const { token } = await createAndAuthenticateUser(app, "ADMIN");
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym 1",
        description: "Some description",
        phone: "",
        latitude: 12.1422147,
        longitude: -68.8300538,
      });
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym 2",
        description: "Some description",
        phone: "",
        latitude: 12.063537,
        longitude: -68.9138518,
      });
    const searchResponse = await request(app.server)
      .get("/gyms/nearby")
      .set("Authorization", `Bearer ${token}`)
      .query({
        latitude: 12.1452877,
        longitude: -68.8213313,
      })
      .send();

    expect(searchResponse.statusCode).toEqual(200);
    expect(searchResponse.body.gyms).toHaveLength(1);
    expect(searchResponse.body.gyms[0]).toEqual(
      expect.objectContaining({
        title: "Javascript Gym 1",
      })
    );
  });
});
