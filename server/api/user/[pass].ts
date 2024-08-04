import { initializeDb, getUserByPasskey } from '../../utils/database'

export default defineEventHandler(async (event) => {
  const db = await initializeDb()
  if (event.method === 'GET') {
    const pass = getRouterParam(event, 'pass') || ''
    const user = await getUserByPasskey(db, pass)

    const stars = user?.stars.split('') ?? []
    let total = 0
    stars?.forEach(n => total += Number(n))

    if (user) {
      db.close()
      return { user: user, rating: total / stars.length }
    }
    else {
      db.close()
      return { user: null }
    }
  }
})
