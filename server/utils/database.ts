import sqlite3 from 'sqlite3'

// FIXME database should not be in "utils", should be in db or store

export interface User {
  id: string
  username: string
  pass_key: string
  image_location: string
  stars: string
}

// FIXME use crypto module
export const generateRandomString = () =>
  [...Array(20)].map(() => Math.random().toString(36)[2]).join('')

export async function initializeDb() {
  const db = new sqlite3.Database('assets/users.db')

  db.serialize(() => {
    db.run(
      `
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY UNIQUE,
        username TEXT UNIQUE,
        pass_key TEXT NOT NULL UNIQUE,
        image_location TEXT,
        stars TEXT
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

export async function createUser(
  db: sqlite3.Database,
  username: string,
  passKey: string,
): Promise<boolean> { // FIXME return Promise<User | null> instead, where User has the id property (or is a basic orm)
  return new Promise((resolve, reject) => {
    const id = generateRandomString()
    const query = `
      INSERT INTO users (id, username, pass_key)
      VALUES (?, ?, ?)
    `

    db.run(query, [id, username, passKey], function (err) {
      if (err) {
        // FIXME run a new query for checking if user exists rather than using this
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

export async function getUserByUsername(
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

export async function getUserByPasskey(
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

export async function updateUsername(
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

export async function getImageLocation(
  db: sqlite3.Database,
  id: string,
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT image_location FROM users WHERE id = ?
    `

    db.get(query, [id], (err, row: User) => {
      if (err) {
        console.error('Error fetching image location:', err)
        reject(err)
      }
      else {
        // FIXME return null instead or fix signature
        resolve(row.image_location ? row.image_location : '')
      }
    })
  })
}

export async function upsertImageLocation(
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

export async function removeImageLocation(
  db: sqlite3.Database,
  id: string,
): Promise<boolean> {
  return new Promise((resolve, reject) => {
    const query = `
      UPDATE users
      SET image_location = NULL
      WHERE id = ?
    `

    db.run(query, [id], function (err) {
      if (err) {
        console.error('Error removing image location:', err)
        reject(err)
      }
      else if (this.changes === 0) {
        resolve(false)
      }
      else {
        console.log(`Image location removed successfully for id ${id}.`)
        resolve(true)
      }
    })
  })
}

export async function getRandomData(db: sqlite3.Database): Promise<{ imageSrc: string, userName: string }> {
  return new Promise((resolve, reject) => {
    const query = `
        SELECT image_location, username
        FROM users
        WHERE image_location IS NOT NULL
        ORDER BY RANDOM()
        LIMIT 1
      `

    db.get(query, (err, row: User) => {
      if (err) {
        console.error('Error fetching random image location:', err)
        reject(err)
      }
      else {
        resolve({ imageSrc: row.image_location, userName: row.username })
      }
    })
  })
}

export async function upsertStarRating(
  db: sqlite3.Database,
  passKey: string,
  newStar: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const selectQuery = `
      SELECT stars FROM users WHERE pass_key = ?
    `
    const updateQuery = `
      UPDATE users SET stars = ? WHERE pass_key = ?
    `

    db.get(selectQuery, [passKey], (err, row: User) => {
      if (err) {
        console.error('Error fetching current star rating:', err)
        reject(err)
        return
      }

      const currentStars = row?.stars || ''
      const updatedStars = currentStars + newStar

      db.run(updateQuery, [updatedStars, passKey], (err) => {
        if (err) {
          console.error('Error updating star rating:', err)
          reject(err)
        }
        else {
          resolve()
        }
      })
    })
  })
}
