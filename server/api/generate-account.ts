import { initializeDb, createUser } from '../utils/database'

export default defineEventHandler(async (event) => {
  const db = initializeDb()
  if (event.method === 'POST') {
    const body = await readBody(event)
    const username = body.username

    if (username) {
      const passKey = BigInt(`0b${[...Array(64)].map(() => Math.random() > 0.5 ? '1' : '0').join('')}`).toString()
      const success = await createUser(db, username, passKey)
      db.close()
      if (success) {
        return { passKey: passKey, username: username }
      }
      else {
        return { error: 'Username is already taken' }
      }
    }
    else {
      db.close()
      return { error: 'Username is required' }
    }
  }
  else {
    db.close()
    return { error: 'Invalid request method' }
  }
})
