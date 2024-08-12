import { UserDatabase } from '../db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'POST') {
    return null
  }
  const db = await UserDatabase.getInstance()

  const body = await readBody(event)

  const fetchedUserIds: string[] = body.fetchedUserIds || []
  const fetchedUserIdsSet = new Set(fetchedUserIds)

  const randomData = await db.getRandomImageIds(fetchedUserIdsSet)
  
  return {
    imageIds: randomData?.imageIds,
    username: randomData?.username,
    userId: randomData?.userId
  }
})
