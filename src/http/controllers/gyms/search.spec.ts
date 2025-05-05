import { afterAll, beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import { app } from "../../../app";
import { createAndAuthenticateUser } from "@/utils/test/create-and-authenticate-user";

describe("Search gym (e2e)", () => {
  beforeAll(async () => {
    await app.ready();
  });

  afterAll(async () => {
    await app.close();
  });
  it("should be able to search a gym", async () => {
    const { token } = await createAndAuthenticateUser(app, "ADMIN");
    await request(app.server)
      .post("/gyms")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Javascript Gym",
        description: "Some description",
        phone: "",
        latitude: -23.55052,
        longitude: -46.633308,
      });
    const searchResponse = await request(app.server)
      .get("/gyms/search")
      .set("Authorization", `Bearer ${token}`)
      .query({
        query: "Javascript Gym",
      })
      .send();

    expect(searchResponse.statusCode).toEqual(200);
    expect(searchResponse.body.gyms).toHaveLength(1);
    expect(searchResponse.body.gyms[0]).toEqual(
      expect.objectContaining({
        title: "Javascript Gym",
      })
    );
  });
});
