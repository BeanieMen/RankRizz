import fs from 'fs/promises';
import crypto from 'crypto';
import { AsyncDatabase } from 'promised-sqlite3';
import sqlite3 from 'sqlite3';

export interface User {
  id: string;
  username: string;
  passKey: string;
}

interface Images {
  id: number;
  userId: string;
  imageLocation: string;
}

export class UserDatabase {
  private db: AsyncDatabase;

  constructor() {
    this.db = new AsyncDatabase(new sqlite3.Database('./server/db/users.db'));
  }

  async initialize(): Promise<void> {
    try {
      const sql = await fs.readFile('./server/db/model.sql', 'utf-8');
      const tables = sql.split(';').filter(command => command.trim());

      for (const table of tables) {
        await this.db.run(table);
      }
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }

  async createUser(id: string, username: string, passKey: string): Promise<User | null> {
    if (await this.getUserViaId(id)) return null;

    const query = `
      INSERT INTO users (id, username, passKey)
      VALUES (?, ?, ?);
    `;
    await this.db.run(query, id, username, passKey);
    return { id, username, passKey };
  }

  async getUserViaId(id: string): Promise<User | null> {
    const query = `
      SELECT id, username, passKey FROM users
      WHERE id = ?;
    `;
    return (await this.db.get(query, id)) || null;
  }

  async getUserViaPass(passKey: string): Promise<User | null> {
    const query = `
      SELECT id, username, passKey FROM users
      WHERE passKey = ?;
    `;
    return (await this.db.get(query, passKey)) || null;
  }

  async getUserViaName(username: string): Promise<User | null> {
    const query = `
      SELECT id, username, passKey FROM users
      WHERE username = ?;
    `;
    return (await this.db.get(query, username)) || null;
  }

  async createStar(imageId: string, starRating: number): Promise<void> {
    const query = `
      INSERT INTO stars (imageId, starReviewCount)
      VALUES (?, ?);
    `;
    await this.db.run(query, imageId, starRating);
  }

  async getStarsById(imageId: string): Promise<Array<{ starReviewCount: number }>> {
    const query = `
      SELECT starReviewCount FROM stars
      WHERE imageId = ?;
    `;
    return this.db.all(query, imageId);
  }

  async addImage(userId: string, imageLocation: string): Promise<void> {
    const query = `
      INSERT INTO images (userId, imageLocation)
      VALUES (?, ?);
    `;
    await this.db.run(query, userId, imageLocation);
  }

  async getImagesById(userId: string): Promise<Array<{ imageLocation: string }>> {
    const query = `
      SELECT imageLocation FROM images
      WHERE userId = ?;
    `;
    return this.db.all(query, userId);
  }

  async getImageIdBySrc(imageSrc: string): Promise<{ id: string }> {
    const query = `
      SELECT id FROM images
      WHERE imageLocation = ?;
    `;
    return this.db.get(query, imageSrc);
  }

  async deleteImages(userId: string): Promise<void> {
    const query = `
      DELETE FROM images WHERE userId = ?;
    `;
    await this.db.run(query, userId);
  }

  async getRandomImageLocation(fetchedUserIds: Set<string>) {
    const userQuery = `
      SELECT userId FROM images
      WHERE userId NOT IN (${Array.from(fetchedUserIds).map(() => '?').join(',')})
      ORDER BY RANDOM()
      LIMIT 1;
    `;
  
    const userRow: Images = await this.db.get(userQuery, ...Array.from(fetchedUserIds));
    if (!userRow?.userId) return null;

    const imagesQuery = `
      SELECT imageLocation FROM images
      WHERE userId = ?;
    `;
    const imageRows: {imageLocation: string}[] = await this.db.all(imagesQuery, userRow.userId);
    const imageLocations = imageRows.map(row => row.imageLocation);
    const user = await this.getUserViaId(userRow.userId);
    
    return {
      username: user?.username,
      imageLocations,
      userId: userRow.userId,
    };
  }

  async addComment(imageId: string, comment: string): Promise<void> {
    const query = `
      INSERT INTO comments (imageId, comment)
      VALUES (?, ?);
    `;
    await this.db.run(query, imageId, comment);
  }

  async getCommentsById(imageId: string): Promise<Array<{ comment: string }>> {
    const query = `
      SELECT comment FROM comments
      WHERE imageId = ?;
    `;
    return this.db.all(query, imageId);
  }
}

export function generateRandomString(): string {
  return crypto.randomBytes(10).toString('hex');
}
