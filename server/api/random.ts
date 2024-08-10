import { UserDatabase } from '../db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return null
  }

  const db = new UserDatabase()
  await db.initialize()

  const randomData = await db.getRandomImageLocation()
  return { imageLocations: randomData?.imageLocations, username: randomData?.username, userId: randomData?.userId }
})
