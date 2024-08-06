import { initializeDb, createUser, generateRandomString } from '../utils/database'

export default defineEventHandler(async (event) => {
  const db = await initializeDb()
  if (event.method === 'POST') {
    const body = await readBody(event)
    const username = body.username

    // FIXME early returns here
    if (username) {
      const passKey = generateRandomString()
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
