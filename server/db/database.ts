import crypto from "crypto";
import { AsyncDatabase } from "promised-sqlite3";
import sqlite3 from "sqlite3";
import { promises as fs } from "fs";
import path from "path";

export interface User {
  id: string;
  username: string;
  pass_key: string;
  image_location: string;
  stars: string;
}

export class UserDatabase {
  private static instance: UserDatabase;
  private db: AsyncDatabase | null = null;

  private constructor() {}

  public static getInstance(): UserDatabase {
    if (!UserDatabase.instance) {
      UserDatabase.instance = new UserDatabase();
    }
    return UserDatabase.instance;
  }

  private async ensureInitialized(): Promise<void> {
    if (!this.db) {
      this.db = new AsyncDatabase(new sqlite3.Database("./server/db/users.db"));
      const schemaPath = path.join(process.cwd(), "server", "db", "schema.sql");
      const schemaSql = await fs.readFile(schemaPath, "utf-8");
      await this.db.exec(schemaSql);
    }
  }

  public async createUser(
    username: string,
    passKey: string
  ): Promise<User | null> {
    await this.ensureInitialized();

    const id = generateRandomString();
    const query = `
      INSERT INTO users (id, username, pass_key)
      VALUES (?, ?, ?)
    `;
    try {
      await this.db!.run(query, [id, username, passKey]);
      console.log(
        `User ${username} created successfully with pass: ${passKey}`
      );
      return { id, username, pass_key: passKey, image_location: "", stars: "" };
    } catch (err: unknown) {
      console.error("Error creating user:", err);
      return null;
    }
  }

  public async getUserByUsername(username: string): Promise<User | null> {
    await this.ensureInitialized();

    const query = `
      SELECT * FROM users WHERE username = ?
    `;
    try {
      const row = (await this.db!.get(query, [username])) as User;
      return row || null;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  public async getUserByPasskey(passKey: string): Promise<User | null> {
    await this.ensureInitialized();

    const query = `
      SELECT * FROM users WHERE pass_key = ?
    `;
    try {
      const row = (await this.db!.get(query, [passKey])) as User;
      return row || null;
    } catch (err) {
      console.error("Error fetching user:", err);
      throw err;
    }
  }

  public async updateUsername(
    username: string,
    passKey: string
  ): Promise<boolean> {
    await this.ensureInitialized();

    if ((await this.getUserByUsername(username)) !== null) return false;

    const query = `
      UPDATE users
      SET username = ?
      WHERE pass_key = ?
    `;
    try {
      const result = await this.db!.run(query, [username, passKey]);
      if (result.changes === 0) return false;
      console.log(`User ${username} updated successfully.`);
      return true;
    } catch (err: unknown) {
      console.error("Error updating user:", err);
      return false;
    }
  }

  public async getImageLocation(id: string): Promise<string | null> {
    await this.ensureInitialized();

    const query = `
      SELECT image_location FROM users WHERE id = ?
    `;
    try {
      const row = (await this.db!.get(query, [id])) as User;
      return row?.image_location || null;
    } catch (err) {
      console.error("Error fetching image location:", err);
      throw err;
    }
  }

  public async upsertImageLocation(
    id: string,
    imageLocation: string
  ): Promise<boolean> {
    await this.ensureInitialized();

    const query = `
      UPDATE users
      SET image_location = ?
      WHERE id = ?
    `;
    try {
      const result = await this.db!.run(query, [imageLocation, id]);
      if (result.changes === 0) return false;
      console.log(`Image location updated successfully for id ${id}.`);
      return true;
    } catch (err) {
      console.error("Error updating image location:", err);
      throw err;
    }
  }

  public async removeImageLocation(id: string): Promise<boolean> {
    await this.ensureInitialized();

    const query = `
      UPDATE users
      SET image_location = NULL
      WHERE id = ?
    `;
    try {
      const result = await this.db!.run(query, [id]);
      if (result.changes === 0) return false;
      console.log(`Image location removed successfully for id ${id}.`);
      return true;
    } catch (err) {
      console.error("Error removing image location:", err);
      throw err;
    }
  }

  public async getRandomData(): Promise<{
    imageSrc: string;
    userName: string;
  }> {
    await this.ensureInitialized();

    const query = `
      SELECT image_location, username
      FROM users
      WHERE image_location IS NOT NULL
      ORDER BY RANDOM()
      LIMIT 1
    `;
    try {
      const row = (await this.db!.get(query)) as User;
      if (row) {
        return { imageSrc: row.image_location, userName: row.username };
      } else {
        return { imageSrc: "", userName: "" };
      }
    } catch (err) {
      console.error("Error fetching random image location:", err);
      throw err;
    }
  }

  public async upsertStarRating(
    passKey: string,
    newStar: string
  ): Promise<void> {
    await this.ensureInitialized();

    const selectQuery = `
      SELECT stars FROM users WHERE pass_key = ?
    `;
    const updateQuery = `
      UPDATE users SET stars = ? WHERE pass_key = ?
    `;
    try {
      const row = (await this.db!.get(selectQuery, [passKey])) as User;
      const currentStars = row?.stars || "";
      const updatedStars = currentStars + newStar;
      await this.db!.run(updateQuery, [updatedStars, passKey]);
    } catch (err) {
      console.error("Error updating star rating:", err);
      throw err;
    }
  }
}

export function generateRandomString(): string {
  return crypto.randomBytes(10).toString("hex");
}
