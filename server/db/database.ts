import fs from 'fs/promises'
import crypto from 'crypto'
import { AsyncDatabase } from 'promised-sqlite3'
import sqlite3 from 'sqlite3'

export interface User {
  id: string
  username: string
  passKey: string
}

interface Images {
  id: number
  userId: string
  imageLocation: string
}

export class UserDatabase {
  private db: AsyncDatabase

  constructor() {
    this.db = new AsyncDatabase(new sqlite3.Database('./server/db/users.db'))
  }

  async initialize(): Promise<void> {
    try {
      const sql = await fs.readFile('./server/db/model.sql', 'utf-8')
      const tables = sql.split(';').filter(command => command.trim())

      for (const table of tables) {
        await this.db.run(table)
      }
    }
    catch (error) {
      console.error('Failed to initialize database:', error)
      throw error
    }
  }

  async createUser(
    id: string,
    username: string,
    passKey: string,
  ): Promise<User | null> {
    // check if user exists
    if ((await this.getUserViaId(id)) !== null) return null

    const query = `
      INSERT INTO users (id, username, passKey)
      VALUES (?, ?, ?);
    `
    await this.db.run(query, id, username, passKey)
    return { id: id, username: username, passKey: passKey }
  }

  async getUserViaId(
    id: string,
  ): Promise<{ id: string, username: string, passKey: string } | null> {
    const query = `
      SELECT id, username, passKey FROM users
      WHERE id = ?;
    `
    const row: User = await this.db.get(query, id)
    return row || null
  }

  async getUserViaPass(
    passKey: string,
  ): Promise<{ id: string, username: string, passKey: string } | null> {
    const query = `
      SELECT id, username, passKey FROM users
      WHERE passKey = ?;
    `
    const row: User = await this.db.get(query, passKey)
    return row || null
  }

  async getUserViaName(
    username: string,
  ): Promise<{ id: string, username: string, passKey: string } | null> {
    const query = `
      SELECT id, username, passKey FROM users
      WHERE username = ?;
    `
    const row: User = await this.db.get(query, username)
    return row || null
  }

  async createStar(userId: string, starRating: number): Promise<void> {
    const query = `
      INSERT INTO stars (userId, starReviewCount)
      VALUES (?, ?);
    `
    await this.db.run(query, userId, starRating)
  }

  async getStarsById(
    userId: string,
  ): Promise<Array<{ starReviewCount: number }>> {
    const query = `
      SELECT starReviewCount FROM stars
      WHERE userId = ?;
    `
    const rows: { starReviewCount: number }[] = await this.db.all(query, userId)
    return rows
  }

  async addImage(userId: string, imageLocation: string): Promise<void> {
    const query = `
      INSERT INTO images (userId, imageLocation)
      VALUES (?, ?);
    `
    await this.db.run(query, userId, imageLocation)
  }

  async getImagesById(
    userId: string,
  ): Promise<Array<{ imageLocation: string }>> {
    const query = `
      SELECT imageLocation FROM images
      WHERE userId = ?;
    `
    const rows: { imageLocation: string }[] = await this.db.all(query, userId)
    return rows
  }

  async deleteImages(userId: string): Promise<void> {
    const query = `
      DELETE FROM images WHERE userId = ?;
    `
    await this.db.run(query, userId)
  }

  async getRandomImageLocation(fetchedUserIds: Set<string>) {
    const userQuery = `
      SELECT userId FROM images
      WHERE userId NOT IN (${Array.from(fetchedUserIds).map(() => '?').join(',')})
      ORDER BY RANDOM()
      LIMIT 1;
    `
  
    const userRow: Images = await this.db.get(userQuery, ...Array.from(fetchedUserIds))
    if (!userRow || !userRow.userId) {
      return null 
    }
  
    const userId = userRow.userId
  
    const imagesQuery = `
      SELECT imageLocation FROM images
      WHERE userId = ?;
    `
    const imageRows: Images[] = await this.db.all(imagesQuery, userId)
    const imageLocations = imageRows.map((row: Images) => row.imageLocation)
    const user = await this.getUserViaId(userId)
    
    return {
      username: user?.username,
      imageLocations: imageLocations,
      userId: userId
    }
  }
  

  async addComment(userId: string, comment: string): Promise<void> {
    const query = `
      INSERT INTO comments (userId, comment)
      VALUES (?, ?);
    `
    await this.db.run(query, userId, comment)
  }

  async getCommentsById(
    userId: string,
  ): Promise<Array<{ comment: string }>> {
    const query = `
      SELECT comment FROM comments
      WHERE userId = ?;
    `
    const rows: { comment: string }[] = await this.db.all(query, userId)
    return rows
  }
}

export function generateRandomString(): string {
  return crypto.randomBytes(10).toString('hex')
}
