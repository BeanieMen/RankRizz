import sqlite3 from 'sqlite3'

interface User {
  id: string
  username: string
  pass_key: string
}

export function initializeDb() {
  const db = new sqlite3.Database('assets/users.db')

  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY,
        username TEXT UNIQUE,
        pass_key INTEGER NOT NULL UNIQUE
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

export function createUser(db: sqlite3.Database, username: string, passKey: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const id = BigInt(`0b${[...Array(64)].map(() => Math.random() > 0.5 ? '1' : '0').join('')}`).toString()
    const query = `
      INSERT INTO users (id, username, pass_key)
      VALUES (?, ?, ?)
    `

    db.run(query, [id, username, passKey], function (err) {
      if (err) {
        console.error('Error creating user:', err)
        if (err.message.includes('UNIQUE constraint failed')) {
          resolve(false)
        }
        else {
          reject(err)
        }
      }
      else {
        console.log(`User ${username} created successfully. with pass: ${passKey}`)
        resolve(true)
      }
    })
  })
}

export function getUserByUsername(db: sqlite3.Database, username: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM users WHERE username = ?
    `

    db.get(query, [username], (err, row) => {
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

export function getUserByPasskey(db: sqlite3.Database, passKey: string): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM users WHERE pass_key = ?
    `

    db.get(query, [passKey], (err, row) => {
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

export function updateUsername(db: sqlite3.Database, username: string, passKey: string): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE users
      SET username = ?
      WHERE pass_key = ?
    `

    db.run(query, [username, passKey], function (err) {
      if (err) {
        console.error('Error updating user:', err)
        if (err.message.includes('UNIQUE constraint failed')) {
          resolve(false)
        }
        else {
          reject(err)
        }
      }
      else {
        console.log(`User ${username} updated successfully.`)
        resolve(true)
      }
    })
  })
}
