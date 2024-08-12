import { UserDatabase, generateRandomString } from '../db/database'

export default defineEventHandler(async (event) => {
  const db = new UserDatabase()
  await db.initialize()

  if (event.method !== 'POST') {
    return { error: 'Invalid request method' }
  }

  const body = await readBody(event)
  const username = body.username as string
  const ipAddress = getRequestHeader(event, 'x-forwarded-for')

  if (!username) {
    return { error: 'Username is required' }
  }

  const ipLookup = await db.getIpLookupByIpAddress(ipAddress ?? "")
  if (ipLookup) {
    return { error: 'An account is already associated with this IP address' }
  }

  const existingUser = await db.getUserViaName(username)
  if (existingUser) {
    return { error: 'Username is already taken' }
  }

  const passKey = generateRandomString()
  const id = generateRandomString()
  const user = await db.createUser(id, username, passKey)

  if (!user) {
    return { error: 'Failed to create user' }
  }

  await db.addIpLookup(ipAddress ?? "", id)

  return { passKey, username, error: null }
})
