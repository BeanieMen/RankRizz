import { UserDatabase } from '../db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return { imageSrc: null, username: null }
  }

  const db = new UserDatabase()
  await db.initialize()

  const randomData = await db.getRandomImageLocation()
  return { imageSrc: randomData?.image_locations, username: randomData?.username }
})
