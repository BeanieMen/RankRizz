import sqlite3 from 'sqlite3'

export function initializeDb() {
  const db = new sqlite3.Database('assets/users.db')

  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        user_id INTEGER NOT NULL UNIQUE
      )
    `,
      (err) => {
        if (err) {
          console.error('Error creating table:', err)
        }
      },
    )
  })
  return db
}

interface User {
  id: number
  username: string
  user_id: string
}

export function upsertUser(
  db: sqlite3.Database,
  username: string | null,
  userId: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = `
      INSERT INTO users (username, user_id)
      VALUES (?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
        username=excluded.username
    `

    db.run(query, [username, userId], function (err) {
      if (err) {
        console.error('Error upserting user:', err)
        if (err.message.includes('UNIQUE constraint failed')) {
          resolve(false)
        }
        else {
          reject(err)
        }
      }
      else {
        console.log(
          `User ${username} with ID ${userId} upserted successfully.`,
        )
        resolve(true)
      }
    })
  })
}

export function getUser(
  db: sqlite3.Database,
  userId: string,
): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `SELECT * FROM users WHERE user_id = ?`

    db.get(query, [userId], (err, row) => {
      if (err) {
        console.error('Error fetching user:', err)
        reject(err)
      }
      else {
        resolve(row ? (row as User) : null)
      }
    })
  })
}
