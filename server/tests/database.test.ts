import { describe, it, expect, beforeEach } from "vitest";
import { UserDatabase } from "../db/database";

let db: UserDatabase;
beforeEach(async () => {
  db = await UserDatabase.getInstance();
  await db.resetDatabase();
});

describe("UserDatabase", () => {
  it("should create and retrieve a user", async () => {
    const user = await db.createUser("1", "testuser", "password");
    expect(user).toBeDefined();
    const retrievedUser = await db.getUserViaId("1");
    expect(retrievedUser).toEqual(user);
  });

  it("should handle image uploads and retrieval", async () => {
    await db.addImage("1", "image1");
    const imageIds = await db.getImageIds("1");
    expect(imageIds).toHaveLength(1);
    expect(imageIds[0]!.id).toEqual("image1");
  });

  it("should not create a user with a duplicate ID", async () => {
    await db.createUser("2", "anotheruser", "password");
    const user = await db.createUser("2", "duplicateuser", "password");
    expect(user).toBeNull();
  });

  it("should handle star creation and retrieval", async () => {
    await db.createStar("image1", 5);
    const stars = await db.getAverageStarRating("image1");
    expect(stars).toEqual(5);
  });

  it("should calculate average star rating correctly", async () => {
    await db.createStar("image1", 4);
    await db.createStar("image1", 5);
    const averageRating = await db.getAverageStarRating("image1");
    expect(averageRating).toBeCloseTo(4.5, 1);
  });

  it("should add and retrieve comments", async () => {
    await db.addComment("image1", "Great photo!");
    const comments = await db.getCommentsById("image1");
    expect(comments).toHaveLength(1);
    expect(comments[0]!.comment).toEqual("Great photo!");
  });

  it("should handle image deletion", async () => {
    await db.deleteImages("1");
    const imageIds = await db.getImageIds("1");
    expect(imageIds).toHaveLength(0);
  });

  it("should handle IP lookup operations", async () => {
    await db.addIpLookup("192.168.1.1", "1");
    const ipLookup = await db.getIpLookupByIpAddress("192.168.1.1");
    expect(ipLookup).toBeDefined();
    expect(ipLookup!.ipAddress).toEqual("192.168.1.1");
    expect(ipLookup!.userId).toEqual("1");
  });

  it("should add and update rating lookup", async () => {
    await db.addRatingLookup("192.168.1.2", "image1");
    let ratingLookup = await db.getRatingLookup("image1");
    expect(ratingLookup).toBeDefined();
    expect(ratingLookup!.ipAddress).toEqual("192.168.1.2");
    expect(ratingLookup!.commented).toBeFalsy();

    await db.upsertRatingLookup("192.168.1.2", "image1", true, false);
    ratingLookup = await db.getRatingLookup("image1");
    expect(ratingLookup!.commented).toBeTruthy();
  });
  it("should retrieve random image IDs not yet fetched", async () => {
    await db.createUser("1", "user1", "pass1");
    await db.createUser("2", "user2", "pass2");

    await db.addImage("1", "image1");
    await db.addImage("2", "image2");

    const fetchedUserIds = new Set<string>(["1"]);
    const randomImages = await db.getRandomImageIds(fetchedUserIds);

    expect(randomImages).toBeDefined();
    expect(randomImages).toHaveLength(1);
    expect(randomImages![0]!.userId).toEqual("2");
    expect(randomImages![0]!.imageIds).toContain("image2");
  });
});
