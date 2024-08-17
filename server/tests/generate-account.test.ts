import { setup } from "@nuxt/test-utils/e2e";
import { describe, it, expect, beforeEach } from "vitest";
import { UserDatabase } from "../db/database";
import type { ApiResponseGenerateAcc } from "./types";
import { createDummyUsers } from "./helpers";

describe("Generate Account Api Route", async () => {
  await setup({
    port: 3000,
    build: false,
  });

  beforeEach(async () => {
    const db = await UserDatabase.getInstance();
    await db.resetDatabase();
  });

  it("POST /generate-account - should create a new user", async () => {
    const response = await fetch("http://localhost:3000/api/generate-account", {
      method: "POST",
      body: JSON.stringify({ username: "testuser" }),
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status).toBe(201);
    const data = await response.json() as ApiResponseGenerateAcc;
    expect(data).toHaveProperty("data");
    expect(data.data).toHaveProperty("passKey");
    expect(data.data).toHaveProperty("username", "testuser");
    expect(data.error).toBeNull();
  });

  it("POST /generate-account - should return error if username is missing", async () => {
    const response = await fetch("http://localhost:3000/api/generate-account", {
      method: "POST",
      body: JSON.stringify({}),
      headers: { "Content-Type": "application/json" },
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Username is required");
  });

  it("POST /generate-account - should return error if IP address is already associated with an account", async () => {
    await createDummyUsers(1);

    const response = await fetch("http://localhost:3000/api/generate-account", {
      method: "POST",
      body: JSON.stringify({ username: "user2" }),
      headers: { "Content-Type": "application/json", "X-Forwarded-For": "192.168.0.0" }, 
    });

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data).toHaveProperty(
      "error",
      "An account is already associated with this IP address"
    );
  });
});
