import { UserDatabase, generateRandomString } from '../db/database'

export default defineEventHandler(async (event) => {
  const db = new UserDatabase()
  await db.initialize()

  if (event.method !== 'POST') {
    return { passKey: null, username: null, error: 'Invalid request method' }
  }

  const body = await readBody(event)
  const username = body.username

  if (!username) {
    return { passKey: null, username: null, error: 'Username is required' }
  }

  const existingUser = await db.getUserViaName(username)
  if (existingUser) {
    return { passKey: null, username: null, error: 'Username is already taken' }
  }

  const passKey = generateRandomString()
  const id = generateRandomString()
  const user = await db.createUser(id, username, passKey)

  if (!user) {
    return { passKey: null, username: null, error: 'Failed to create user' }
  }

  return { passKey, username, error: null }
})
