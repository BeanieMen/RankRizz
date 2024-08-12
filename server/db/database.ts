import fs from "fs/promises";
import crypto from "crypto";
import { AsyncDatabase } from "promised-sqlite3";
import sqlite3 from "sqlite3";

export interface User {
  id: string;
  username: string;
  passKey: string;
}

interface Images {
  id: number;
  userId: string;
}

export class UserDatabase {
  private db: AsyncDatabase;

  constructor() {
    this.db = new AsyncDatabase(new sqlite3.Database("./server/db/users.db"));
  }

  async initialize(): Promise<void> {
    try {
      const sql = await fs.readFile("./server/db/model.sql", "utf-8");
      const tables = sql.split(";").filter((command) => command.trim());

      for (const table of tables) {
        await this.db.run(table);
      }
    } catch (error) {
      console.error("Failed to initialize database:", error);
      throw error;
    }
  }

  async createUser(
    id: string,
    username: string,
    passKey: string
  ): Promise<User | null> {
    if (await this.getUserViaId(id)) return null;

    const query = `
      INSERT INTO Users (id, username, passKey)
      VALUES (?, ?, ?);
    `;
    await this.db.run(query, id, username, passKey);
    return { id, username, passKey };
  }

  async getUserViaId(id: string): Promise<User | null> {
    const query = `
      SELECT id, username, passKey FROM Users
      WHERE id = ?;
    `;
    return (await this.db.get(query, id)) || null;
  }

  async getUserViaPass(passKey: string): Promise<User | null> {
    const query = `
      SELECT id, username, passKey FROM Users
      WHERE passKey = ?;
    `;
    return (await this.db.get(query, passKey)) || null;
  }

  async getUserViaName(username: string): Promise<User | null> {
    const query = `
      SELECT id, username, passKey FROM Users
      WHERE username = ?;
    `;
    return (await this.db.get(query, username)) || null;
  }

  async createStar(imageId: string, starRating: number): Promise<void> {
    const query = `
      INSERT INTO Stars (imageId, starRating)
      VALUES (?, ?);
    `;
    await this.db.run(query, imageId, starRating);
  }

  async getStarsById(
    imageId: string
  ): Promise<Array<{ starRating: number }>> {
    const query = `
      SELECT starRating FROM Stars
      WHERE imageId = ?;
    `;
    return this.db.all(query, imageId);
  }

  async addImage(userId: string, id: string): Promise<void> {
    const query = `
      INSERT INTO Images (userId, id)
      VALUES (?, ?);
    `;
    await this.db.run(query, userId, id);
  }


  async deleteImages(userId: string): Promise<void> {
    const query = `
      DELETE FROM Images WHERE userId = ?;
    `;
    await this.db.run(query, userId);
  }

  async getImageIds(
    userId: string
  ): Promise<Array<{ id: string }>> {
    const query = `
      SELECT id FROM Images
      WHERE userId = ?;
    `;
    return this.db.all(query, userId);
  }
  async getRandomImageIds(fetchedUserIds: Set<string>) {
    const userQuery = `
      SELECT userId FROM Images
      WHERE userId NOT IN (${Array.from(fetchedUserIds)
        .map(() => "?")
        .join(",")})
      ORDER BY RANDOM()
      LIMIT 1;
    `;

    const userRow: Images = await this.db.get(
      userQuery,
      ...Array.from(fetchedUserIds)
    );
    if (!userRow?.userId) return null;

    const imagesQuery = `
      SELECT id FROM Images
      WHERE userId = ?;
    `;
    const imageRows: { id: string }[] = await this.db.all(
      imagesQuery,
      userRow.userId
    );
    const imageIds = imageRows.map((row) => row.id);
    const user = await this.getUserViaId(userRow.userId);

    return {
      username: user?.username,
      imageIds,
      userId: userRow.userId,
    };
  }

  async addComment(imageId: string, comment: string): Promise<void> {
    const query = `
      INSERT INTO Comments (imageId, comment)
      VALUES (?, ?);
    `;
    await this.db.run(query, imageId, comment);
  }

  async getCommentsById(imageId: string): Promise<Array<{ comment: string }>> {
    const query = `
      SELECT comment FROM Comments
      WHERE imageId = ?;
    `;
    return this.db.all(query, imageId);
  }

  async addIpLookup(ipAddress: string, userId: string): Promise<void> {
    const query = `
      INSERT INTO IpLookup (ipAddress, userId)
      VALUES (?, ?);
    `;
    await this.db.run(query, ipAddress, userId);
  }

  async getIpLookupByIpAddress(
    ipAddress: string
  ): Promise<{ id: number; ipAddress: string; userId: string } | null> {
    const query = `
      SELECT * FROM IpLookup
      WHERE ipAddress = ?;
    `;
    return (await this.db.get(query, ipAddress)) || null;
  }

  async addRatingLookup(
    ipAddress: string,
    imageId: string,
  ): Promise<void> {
    const query = `
      INSERT INTO RatingLookup (ipAddress, imageId, commented, starRated)
      VALUES (?, ?, ?, ?)
    `;
    await this.db.run(query, ipAddress, imageId, false, false);
  }

  async getRatingLookup(
    imageId: string
  ): Promise<{
    ipAddress: string;
    imageId: string;
    commented: boolean;
    starRated: boolean;
  } | null> {
    const query = `
      SELECT * FROM RatingLookup
      WHERE imageId = ?;
    `;
    return (await this.db.get(query, imageId)) || null;
  }

  async upsertRatingLookup(ipAddress: string, imageId: string, commented: boolean, starRated: boolean): Promise<void> {
    const query = `
      INSERT INTO RatingLookup (ipAddress, imageId, commented, starRated)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(ipAddress, imageId)
      DO UPDATE SET
        commented = excluded.commented,
        starRated = excluded.starRated;
    `;
    await this.db.run(query, ipAddress, imageId, commented, starRated);
  }
  
}

export function generateRandomString(): string {
  return crypto.randomBytes(10).toString("hex");
}
