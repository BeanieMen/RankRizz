import { UserDatabase } from '~~/server/db/database'

export default defineEventHandler(async (event) => {
  if (event.method !== 'GET') {
    return { user: null, rating: null, imageLocations: null, starCount: null }
  }


  const db = new UserDatabase()
  await db.initialize()

  const passKey = getRouterParam(event, 'pass') || ''
  const user = await db.getUserViaPass(passKey)

  if (user) {
    const imageLocationData = await db.getImagesById(user.id)
    const imageLocations = imageLocationData.map(obj => obj.image_location)

    const stars = await db.getStarsById(user.id)
    const rating = stars.reduce((a, b) => a + b.star_rating, 0) / stars.length
    return { user: user, rating: rating, imageLocations: imageLocations, starCount: stars.length }
  }
  else {
    return { user: null, rating: null, imageLocations: null, starCount: null }
  }
})
