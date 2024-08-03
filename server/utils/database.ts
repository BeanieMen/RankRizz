import sqlite3 from 'sqlite3'

export interface User {
  id: string
  username: string
  pass_key: string
  image_location: string
}

export const generateRandomString = () =>
  [...Array(20)].map(() => Math.random().toString(36)[2]).join('')

export function initializeDb() {
  const db = new sqlite3.Database('assets/users.db')

  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY UNIQUE,
        username TEXT UNIQUE,
        pass_key TEXT NOT NULL UNIQUE,
        image_location TEXT
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

export function createUser(
  db: sqlite3.Database,
  username: string,
  passKey: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const id = generateRandomString()
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
        console.log(
          `User ${username} created successfully with pass: ${passKey}`,
        )
        resolve(true)
      }
    })
  })
}

export function getUserByUsername(
  db: sqlite3.Database,
  username: string,
): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM users WHERE username = ?
    `

    db.get(query, [username], (err, row: User) => {
      if (err) {
        console.error('Error fetching user:', err)
        reject(err)
      }
      else {
        resolve(row)
      }
    })
  })
}

export function getUserByPasskey(
  db: sqlite3.Database,
  passKey: string,
): Promise<User | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT * FROM users WHERE pass_key = ?
    `

    db.get(query, [passKey], (err, row: User) => {
      if (err) {
        console.error('Error fetching user:', err)
        reject(err)
      }
      else {
        resolve(row)
      }
    })
  })
}

export function updateUsername(
  db: sqlite3.Database,
  username: string,
  passKey: string,
): Promise<boolean> {
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

export function getImageLocation(
  db: sqlite3.Database,
  passKey: string,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT image_location FROM users WHERE pass_key = ?
    `

    db.get(query, [passKey], (err, row: User) => {
      if (err) {
        console.error('Error fetching image location:', err)
        reject(err)
      }
      else {
        resolve(row.image_location)
      }
    })
  })
}

export function upsertImageLocation(
  db: sqlite3.Database,
  id: string,
  imageLocation: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE users
      SET image_location = ?
      WHERE id = ?
    `

    db.run(query, [imageLocation, id], function (err) {
      if (err) {
        console.error('Error updating image location:', err)
        reject(err)
      }
      else if (this.changes === 0) {
        resolve(false)
      }
      else {
        console.log(`Image location updated successfully for id ${id}.`)
        resolve(true)
      }
    })
  })
}

export function getRandomData(db: sqlite3.Database): Promise<{ imageSrc: string, userName: string }> {
  return new Promise((resolve, reject) => {
    const fetchImage = () => {
      const query = `
      SELECT image_location, username
      FROM users
      ORDER BY RANDOM()
      LIMIT 1
    `

      db.get(query, (err, row: User) => {
        if (err) {
          console.error('Error fetching random image location:', err)
          reject(err)
        }
        else if (!row?.image_location) {
          console.warn('No image location found, retrying...')
          fetchImage() // Recursive call to retry
        }
        else {
          resolve({ imageSrc: row.image_location, userName: row.username })
        }
      })
    }

    fetchImage()
  })
}
