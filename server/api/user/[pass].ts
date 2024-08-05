import { initializeDb, getUserByPasskey } from '../../utils/database'

export default defineEventHandler(async (event) => {
  const db = await initializeDb()
  if (event.method === 'GET') {
    const pass = getRouterParam(event, 'pass') || ''
    const user = await getUserByPasskey(db, pass)

    if (user) {
      db.close()
      const stars = user.stars ? user.stars.split('') : []
      let total = 0
      stars?.forEach(n => total += Number(n))
      return { user: user, rating: total / stars.length }
    }
    else {
      db.close()
      return { user: null, rating: null }
    }
  }
})
