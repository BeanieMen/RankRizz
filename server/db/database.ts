import fs from 'fs/promises'
import crypto from 'crypto'
import { AsyncDatabase } from 'promised-sqlite3'
import sqlite3 from 'sqlite3'

export interface User {
  id: string
  username: string
  pass_key: string
}

interface Images {
  id: number
  user_id: string
  image_location: string
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
      INSERT INTO users (id, username, pass_key)
      VALUES (?, ?, ?);
    `
    await this.db.run(query, id, username, passKey)
    return { id: id, username: username, pass_key: passKey }
  }

  async getUserViaId(
    id: string,
  ): Promise<{ id: string, username: string, pass_key: string } | null> {
    const query = `
      SELECT id, username, pass_key FROM users
      WHERE id = ?;
    `
    const row: User = await this.db.get(query, id)
    return row || null
  }

  async getUserViaPass(
    passKey: string,
  ): Promise<{ id: string, username: string, pass_key: string } | null> {
    const query = `
      SELECT id, username, pass_key FROM users
      WHERE pass_key = ?;
    `
    const row: User = await this.db.get(query, passKey)
    return row || null
  }

  async getUserViaName(
    username: string,
  ): Promise<{ id: string, username: string, pass_key: string } | null> {
    const query = `
      SELECT id, username, pass_key FROM users
      WHERE username = ?;
    `
    const row: User = await this.db.get(query, username)
    return row || null
  }

  async createStar(userId: string, starRating: number): Promise<void> {
    const query = `
      INSERT INTO stars (user_id, star_rating)
      VALUES (?, ?);
    `
    await this.db.run(query, userId, starRating)
  }

  async getStarsById(
    userId: string,
  ): Promise<Array<{ star_rating: number }>> {
    const query = `
      SELECT star_rating FROM stars
      WHERE user_id = ?;
    `
    const rows: { star_rating: number }[] = await this.db.all(query, userId)
    return rows
  }

  async addImage(userId: string, imageLocation: string): Promise<void> {
    const query = `
      INSERT INTO images (user_id, image_location)
      VALUES (?, ?);
    `
    await this.db.run(query, userId, imageLocation)
  }

  async getImagesById(
    userId: string,
  ): Promise<Array<{ image_location: string }>> {
    const query = `
      SELECT image_location FROM images
      WHERE user_id = ?;
    `
    const rows: { image_location: string }[] = await this.db.all(query, userId)
    return rows
  }

  async deleteImages(userId: string): Promise<void> {
    const query = `
      DELETE FROM images WHERE user_id = ?;
    `
    await this.db.run(query, userId)
  }

  async getRandomImageLocation() {
    const userQuery = `
      SELECT user_id FROM images
      ORDER BY RANDOM()
      LIMIT 1;
    `
    const userRow: Images = await this.db.get(userQuery)
    if (!userRow || !userRow.user_id) {
      return null
    }

    const userId = userRow.user_id

    const imagesQuery = `
    SELECT image_location FROM images
    WHERE user_id = ?;
  `
    const imageRows: Images[] = await this.db.all(imagesQuery, userId)
    const imageLocations = imageRows.map((row: Images) => row.image_location)
    const user = await this.getUserViaId(userId)
    return {
      username: user?.username,
      image_locations: imageLocations,
    }
  }

  async close(): Promise<void> {
    await this.db.close()
  }
}

export function generateRandomString(): string {
  return crypto.randomBytes(10).toString('hex')
}
