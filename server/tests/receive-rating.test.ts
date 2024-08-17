import { setup } from "@nuxt/test-utils/e2e";
import { describe, it, expect, beforeEach } from "vitest";
import { UserDatabase } from "../db/database";
import { createDummyUsers } from "./helpers";
describe("Receive Rating API Route", async () => {
  await setup({
    port: 3000,
    build: false,
  });

  let db: UserDatabase;

  beforeEach(async () => {
    db = await UserDatabase.getInstance();
    await db.resetDatabase();
  });

  const postReceiveRating = async (data: Record<string, string>) => {
    return fetch("http://localhost:3000/api/receive-rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Forwarded-For": "192.168.0.0",
      },
      body: new URLSearchParams(data),
    });
  };

  it("POST /receive-rating - should return 200 for valid rating", async () => {
    const { users } = await createDummyUsers(1, true);
    const images = await db.getImageIds(users[0]!.id);
    const imageId = images[0]?.id;

    const response = await postReceiveRating({
      starRating: "5",
      imageId: imageId!,
    });

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty("message", "Successfully uploaded ratings");
  });

  it("POST /receive-rating - should return 400 for missing image ID", async () => {
    const response = await postReceiveRating({
      starRating: "5",
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Image ID is missing");
  });

  it("POST /receive-rating - should return 400 for missing data", async () => {
    const response = await postReceiveRating({
      imageId: "dummy-id",
    });

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Missing or invalid rating/comment");
  });

  it("POST /receive-rating - should return 409 for duplicate comment", async () => {
    const { users } = await createDummyUsers(1, true);
    const images = await db.getImageIds(users[0]!.id);
    const imageId = images[0]?.id;

    await postReceiveRating({
      comment: "Great photo!",
      imageId: imageId!,
    });

    const response = await postReceiveRating({
      comment: "Great photo!",
      imageId: imageId!,
    });

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Duplicate comment");
  });

  it("POST /receive-rating - should return 409 for duplicate rating", async () => {
    const { users } = await createDummyUsers(1, true);
    const images = await db.getImageIds(users[0]!.id);
    const imageId = images[0]?.id;

    await postReceiveRating({
      starRating: "5",
      imageId: imageId!,
    });
    
    const response = await postReceiveRating({
      starRating: "5",
      imageId: imageId!,
    });

    expect(response.status).toBe(409);
    const data = await response.json();
    expect(data).toHaveProperty("error", "Duplicate rating");
  });
});
