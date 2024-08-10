import { UserDatabase } from '../db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return { imageLocations: null, username: null }
  }

  const db = new UserDatabase()
  await db.initialize()

  const randomData = await db.getRandomImageLocation()
  return { imageLocations: randomData?.image_locations, username: randomData?.username }
})
