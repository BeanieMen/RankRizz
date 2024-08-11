import { UserDatabase } from '../db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return null
  }

  const db = new UserDatabase()
  await db.initialize()

  const body = await readBody(event)

  const fetchedUserIds: string[] = body.fetchedUserIds || []
  const fetchedUserIdsSet = new Set(fetchedUserIds)

  const randomData = await db.getRandomImageLocation(fetchedUserIdsSet)
  
  return {
    imageLocations: randomData?.imageLocations,
    username: randomData?.username,
    userId: randomData?.userId
  }
})
