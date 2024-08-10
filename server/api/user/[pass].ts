import { UserDatabase } from '~~/server/db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return null
  }


  const db = new UserDatabase()
  await db.initialize()

  const passKey = getRouterParam(event, 'pass') || ''
  const user = await db.getUserViaPass(passKey)

  if (user) {
    const imageLocationData = await db.getImagesById(user.id)
    const imageLocations = imageLocationData.map(obj => obj.imageLocation)
    const commentsData = await db.getCommentsById(user.id)
    const comments = commentsData.map(obj => obj.comment)
    const stars = await db.getStarsById(user.id)
    const rating = stars.reduce((a, b) => a + b.starReviewCount, 0) / stars.length

    return { user: user, rating: rating, imageLocations: imageLocations, starReviewCount: stars.length, comments: comments }
  }
  else {
    return null
  }
})
