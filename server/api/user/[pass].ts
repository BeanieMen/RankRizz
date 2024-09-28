import { setResponseStatus } from 'h3'
import { UserDatabase } from '~~/server/db/database'

export default defineEventHandler(async (event) => {
  const db = await UserDatabase.getInstance()
  const passKey = getRouterParam(event, 'pass') || ''
  const user = await db.getUserViaPass(passKey)

  if (!user) {
    setResponseStatus(event, 404)
    return { error: 'User not found' }
  }

  try {
    const imageIds = (await db.getImageIds(user.id)).map(obj => obj.id)

    const [comments, starRatingAverages, starRatingTotals] = await Promise.all([
      getCommentsForImages(db, imageIds),
      getStarRatingsForImages(db, imageIds).then(ratings => ratings.starRatingAverages),
      getStarRatingsForImages(db, imageIds).then(ratings => ratings.starRatingTotals),
    ])

    setResponseStatus(event, 200)
    return {
      error: null,
      data: {
        user,
        starRatingAverages,
        imageIds,
        starRatingTotals,
        comments,
      },
    }
  }
  catch (error) {
    console.error('Error fetching user data:', error)
    setResponseStatus(event, 500)
    return { error: 'Error fetching user data' }
  }
})

async function getCommentsForImages(
  db: UserDatabase,
  imageIds: string[],
): Promise<string[][]> {
  const commentsData = await Promise.all(
    imageIds.map(async (imageId) => {
      const comments = await db.getCommentsById(imageId)
      return comments.map(obj => obj.comment)
    }),
  )

  return commentsData
}

async function getStarRatingsForImages(
  db: UserDatabase,
  imageIds: string[],
): Promise<{ starRatingAverages: number[], starRatingTotals: number[] }> {
  const starRatingTotals = new Array(imageIds.length)
  const starRatingAverages = new Array(imageIds.length)

  await Promise.all(
    imageIds.map(async (imageId, index) => {
      starRatingTotals[index] = await db.getTotalStarsCount(imageId)
      starRatingAverages[index] = await db.getAverageStarRating(imageId)
    }),
  )

  return { starRatingAverages, starRatingTotals }
}
