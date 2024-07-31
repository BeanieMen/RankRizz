import crypto from 'crypto'
import { initializeDb, upsertUser } from '../utils/database'

export default defineEventHandler(async (event) => {
  const db = initializeDb()
  if (event.method === 'POST') {
    const body = await readBody(event)
    const username = body.username

    if (username) {
      const userId = BigInt(`0x${crypto.randomBytes(8).toString('hex')}`).toString()
      const success = await upsertUser(db, username, userId)
      db.close()
      if (success) {
        return { id: userId.toString(), username: username }
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
