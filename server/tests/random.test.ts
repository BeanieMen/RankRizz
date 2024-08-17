import { setup } from "@nuxt/test-utils/e2e";
import { describe, it, expect, beforeEach } from "vitest";
import { UserDatabase } from "../db/database";
import { createDummyUsers } from "./helpers";

describe("Random Api Route", async () => {
  await setup({
    port: 3000,
    build: false,
  });

  beforeEach(async () => {
    const db = await UserDatabase.getInstance();
    await db.resetDatabase();
  });

  it("GET /random - should return random user data", async () => {
    await createDummyUsers(1, true);

    const response = await fetch("http://localhost:3000/api/random", {
      method: "GET",
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("data");
    expect(data.data).toHaveProperty("randomUsers");
    expect(Array.isArray(data.data.randomUsers)).toBe(true);
  });

  it("GET /random - should return no random user data", async () => {
    await createDummyUsers(1);

    const response = await fetch("http://localhost:3000/api/random", {
      method: "GET",
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("data");
    expect(data.data).toHaveProperty("randomUsers");
    expect(Array.isArray(data.data.randomUsers)).toBe(false);
  });
});
