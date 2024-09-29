import fs from "fs/promises";
import crypto from "crypto";
import { AsyncDatabase } from "promised-sqlite3";
import sqlite3 from "sqlite3";
import { config } from "dotenv";
export interface User {
  id: string;
  username: string;
  passKey: string;
}

export class UserDatabase {
  private static instance: UserDatabase;
  private db: AsyncDatabase;

  private constructor() {
    if (process.env.NODE_ENV == "test") {
      config({ path: "./server/tests/.test.env" });
    } else {
      config();
    }

    if (!process.env.DB_FILE) {
      throw new Error("DB_FILE environment variable is not set");
    }

    this.db = new AsyncDatabase(new sqlite3.Database(process.env.DB_FILE));
  }

  public static async getInstance(): Promise<UserDatabase> {
    if (!UserDatabase.instance) {
      UserDatabase.instance = new UserDatabase();
      try {
        const sql = await fs.readFile("./server/db/model.sql", "utf-8");
        const tables = sql.split(";").filter((command) => command.trim());
        for (const table of tables) {
          await UserDatabase.instance.db.run(table);
        }
      } catch (error) {
        console.error("Failed to initialize database:", error);
        throw error;
      }
    }
    return UserDatabase.instance;
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
    const user: User = await this.db.get(query, id);
    return user;
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

  async getTotalStarsCount(imageId: string): Promise<number> {
    const query = `
      SELECT COUNT(*) as count FROM Stars
      WHERE imageId = ?;
    `;
    const result: { count: number } | undefined = await this.db.get(
      query,
      imageId
    );
    return result?.count || 0;
  }

  async getAverageStarRating(imageId: string): Promise<number> {
    const query = `
      SELECT AVG(starRating) as average FROM Stars
      WHERE imageId = ?;
    `;
    const result: { average: number | null } | undefined = await this.db.get(
      query,
      imageId
    );
    return result?.average || 0;
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

  async getImageIds(userId: string): Promise<Array<{ id: string }>> {
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
      LIMIT 5;
    `;

    const userRows: { userId: string }[] = await this.db.all(
      userQuery,
      ...Array.from(fetchedUserIds)
    );
    if (userRows.length === 0) return null;

    const result = [];

    for (const userRow of userRows) {
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

      result.push({
        username: user?.username,
        imageIds,
        userId: userRow.userId,
      });
    }

    return result;
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

  async addRatingLookup(ipAddress: string, imageId: string): Promise<void> {
    const query = `
      INSERT INTO RatingLookup (ipAddress, imageId, commented, starRated)
      VALUES (?, ?, ?, ?)
    `;
    await this.db.run(query, ipAddress, imageId, false, false);
  }

  async getRatingLookup(imageId: string): Promise<{
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

  async upsertRatingLookup(
    ipAddress: string,
    imageId: string,
    commented: boolean,
    starRated: boolean
  ): Promise<void> {
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

  async resetDatabase(): Promise<void> {
    const queries = [
      `DELETE FROM Comments;`,
      `DELETE FROM Stars;`,
      `DELETE FROM Images;`,
      `DELETE FROM Users;`,
      `DELETE FROM IpLookup;`,
      `DELETE FROM RatingLookup;`,
    ];
    for (const query of queries) {
      await this.db.run(query);
    }
  }
}

export function generateUUID(): string {
  return crypto.randomBytes(10).toString("hex");
}
